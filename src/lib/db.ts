import OrbitDB from 'orbit-db';
import { type IPFS, create as createIPFSInstance } from 'ipfs-core';

import config from './ipfs-config'
import { DBPermission, DBType } from "./types";
import { AddEntry as AddDocStoreEntry, queryEntries as fetchDocEntries, deleteEntry as delDocumentEntry } from "./docs-store";
import { addEntry as AddFeedStoreEntry, iterator as queryFeedEntries, deleteEntry as deleteFeedEntry } from "./feed-store";


export let orbitdb: any | null = null; //* OrbitDB instance
export let program: any | null = null; //* Programs database
export let ipfs: IPFS | null = null; //* IPFS instance

let starting_ipfs = false;


//* ---------------------- T Y P E S ---------------------- *//

type addEntryOptions = {
  pin: boolean;
  entry: Record<string, any>;
}

export type IteratorQueryOptions = {
  limit?: number;
  lte?: string;
  lt?: string;
  gte?: string;
  gt?: string;
  reverse?: boolean;
}

type fetchDbOptions = {
  dbInstance?: any,
  hash?: string;
  query?: IteratorQueryOptions;
  docsOptions?: {
    fullOp: boolean;
  }
}


//* ----------------------  F U N C T I O N S ---------------------- *//

export const initIPFS = async () => {

  if (ipfs)
    return ipfs

  if (starting_ipfs)

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (ipfs) {
          clearInterval(interval);
          resolve(ipfs)
        }
      }, 100)
    });

  starting_ipfs = true;
  ipfs = await createIPFSInstance(config.ipfs);
  starting_ipfs = false;

  return ipfs
}

export const initOrbitDB = async (ipfs: any) => {

  if (orbitdb)
    return orbitdb as OrbitDB;

  orbitdb = await OrbitDB.createInstance(ipfs, {});
  return orbitdb as OrbitDB;
}

export const getAllDatabases = async () => {

  if (!program && orbitdb) {

    program = await orbitdb.feed('network.programs', {
      accessController: { write: [ orbitdb.identity.id ] },
      create: true
    });

    if (program)
      await program.load()
  }

  return program ? program.iterator({ limit: -1 }).collect() : []
}

export const getProgramByHash = (multiHash: string) => {

  if (program && orbitdb) {

    const db = program.iterator({ limit: -1 }).collect().find((db: any) => db.hash === multiHash);
    if (db) {
      return {
        name: db.payload.value.name,
        type: db.payload.value.type,
        address: db.payload.value.address,
        added: db.payload.value.added
      }
    }
  }

  return null;
}

export const getDB = async (address: string) => {

  let db = null;
  if (orbitdb) {
    db = await orbitdb.open(address)
    await db.load()
  }

  return db
}

export const fetchEntry = async (address: string, likeMultiHashOrKey: string) => {

  const db = await getDB(address);
  if (!db)
    return null;

  switch (db.type) {
    case 'feed':
      return await db.get(likeMultiHashOrKey);
    case 'eventlog':
      return await db.get(likeMultiHashOrKey);
    case 'docstore':
      return await db.get(likeMultiHashOrKey);
    case 'keyvalue':
      return await db.get(likeMultiHashOrKey);
    case 'counter':
      return db.value || 0;
    default:
      return null;
  }
}

export const fetchEntries = async (
  address: string,
  options: fetchDbOptions = {
    dbInstance: null,
    hash: '',
    docsOptions: {
      fullOp: false
    },
    query: {
      limit: 10,
      gt: '',
      gte: '',
      lt: '',
      lte: '',
      reverse: true
  }
  }) => {

  const { dbInstance, docsOptions, query } = options;
  const { fullOp = false } = docsOptions || {};

  const db = await dbInstance ? await new Promise((resolve) => resolve(dbInstance)) : await getDB(address);
  if (!db)
    return null;

  switch (db.type) {
    case 'feed':
      return queryFeedEntries({
        feedstore: db,
        fullOp: fullOp,
        query: query || { limit: 1 }
      });
    case 'eventlog':
      const _entries = await db.iterator(query).collect();
      return _entries;
    case 'docstore':
      return fetchDocEntries({
        docstore: db,
        mapper: (e: any) => e !== null,
        options: {
          fullOp: fullOp
        }
      });
    case 'keyvalue':
      const all = await db.all;
      return Object.keys(all).map(e => ({ payload: { key: e, value: db.get(e) } }));
    case 'counter':
      return db.value || 0;
    default:
      return null;
  }
}

export const addEntry = async (address: string, options: addEntryOptions) => {

  const db = await getDB(address);
  if (!db)
    return null;

  const { pin = false, entry } = options || {};
  const key = Object.keys(entry)[ 0 ];
  const value = entry[ key ];

  switch (db.type) {
    case 'feed':
      return AddFeedStoreEntry({
        feedstore: db,
        entry,
        pin,
      });
    case 'eventlog':
      return db.add(entry, { pin });
    case 'docstore':
      return AddDocStoreEntry({
        docstore: db,
        entry,
        pin,
      });
    case 'keyvalue':

      if (!entry.key)
        return Promise.reject('Key is required for keyvalue database');
      const theKey = entry.key;
      const _entry = { ...entry };
      delete _entry[ 'key' ];
      return db.put(theKey, _entry);
    case 'counter':
      return db.inc(value);
    default:
      return null;
  }
}

export const removeEntry = async (address: string, likeMultiHashOrKey: string) => {

  const db = await getDB(address);
  if (!db)
    throw new Error('Database not found');

  switch (db.type) {
    case 'feed':
      return deleteFeedEntry({
        feedstore: db,
        hash: likeMultiHashOrKey
      });

    case 'eventlog':
      throw new Error('Eventlog database does not support delete operation');
    case 'docstore':
      return delDocumentEntry({
        docstore: db,
        key: likeMultiHashOrKey
      });
    case 'keyvalue':
      return db.del(likeMultiHashOrKey);
    case 'counter':
      throw new Error('Counter database does not support delete operation');
    default:
      throw new Error('Database type not supported');
  }
}

export const addDatabase = async (address: string) => {

  if (!orbitdb)
    return Promise.reject('OrbitDB not initialized');

  if (!program)
    return Promise.reject('Programs database not initialized');

  const db = await orbitdb.open(address)
  return program.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now()
  })
}

export const createDatabase = async (
  {
    name,
    type,
    permissions
  }: {
    name: string,
    type: DBType,
    permissions: DBPermission
  }
) => {

  if (!orbitdb) {
    await initOrbitDB(ipfs);
    if (!orbitdb)
      return Promise.reject('OrbitDB not initialized');
  }

  if (!program) {
    await getAllDatabases();
    if (!program)
      return Promise.reject('Programs database not initialized');
  }

  let accessController = {};

  switch (permissions) {
    case 'public':
      accessController = { write: [ '*' ] }
      break
    default:
      accessController = {
        write: [

          // Give write access to ourselves
          orbitdb.identity.id ]
      }
      break
  }


  const options = {

    // Setup write access
    accessController,
  }

  let db = null;

  switch (type) {
    case DBType.keyvalue:
      db = await orbitdb.keyvalue(name, options);
      break;
    case DBType.counter:
      db = await orbitdb.counter(name, options);
      break;
    case DBType.feed:
      db = await orbitdb.feed(name, options);
      break;
    case DBType.eventlog:
      db = await orbitdb.eventlog(name, options);
      break;
    case DBType.docstore:
      db = await orbitdb.docstore(name, options);
      break;
    default:
      throw new Error('Invalid database type');
  }

  const hash = program.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  });

  return {
    db,
    hash
  };
}

export const removeDatabase = async (hash: string) => {

  if (!program)
    return Promise.reject('Programs database not initialized');

  const db = program.iterator({ limit: -1 }).collect().find((db: any) => db.hash === hash);
  if (db) {
    await program.remove(db.hash);
    return true;
  }

  return false;
}
