import OrbitDB from 'orbit-db';
import { type IPFS, create as createIPFSInstance } from 'ipfs-core';

import config from './ipfs-config'
import { DBPermission, DBType } from "./types";
import { AddEntry as AddDocStoreEntry } from "./docs-store";


export let orbitdb: any | null = null; //* OrbitDB instance
export let programs: any | null = null; //* Programs database
export let ipfs: IPFS | null = null; //* IPFS instance

let starting_ipfs = false;


//* ---------------------- T Y P E S ---------------------- *//

type addEntryOptions = {
  pin: boolean;
  entry: Record<string, any>;
}

type fetchQueryOptions = {
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
  query?: fetchQueryOptions;
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
    })

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

  if (!programs && orbitdb) {

    // Load programs database
    programs = await orbitdb.feed('network.programs', {
      accessController: { write: [ orbitdb.identity.id ] },
      create: true
    });

    if (programs)
      await programs.load()
  }

  return programs ? programs.iterator({ limit: -1 }).collect() : []
}

export const getProgramByHash = (multiHash: string) => {

  if (programs && orbitdb) {

    const db = programs.iterator({ limit: -1 }).collect().find((db: any) => db.hash === multiHash);
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
      return await db.iterator(query).collect();
    case 'eventlog':
      const _entries = await db.iterator(query).collect();
      return _entries;
    case 'docstore':
      return await db.query((e: any) => e !== null, { fullOp: fullOp });
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
      return db.put(entry, value, { pin });
    case 'eventlog':
      return db.add(entry, { pin });
    case 'docstore':
      // return db.put(entry);
      return AddDocStoreEntry({
        docstore: db,
        entry,
        id: key
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

export const addDatabase = async (address: string) => {

  if (!orbitdb)
    return Promise.reject('OrbitDB not initialized');

  if (!programs)
    return Promise.reject('Programs database not initialized');

  const db = await orbitdb.open(address)
  return programs.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now()
  })
}

export const createDatabase = async (name: string, type: DBType, permissions: DBPermission) => {

  if (!orbitdb) {
    await initOrbitDB(ipfs);
    if (!orbitdb)
      return Promise.reject('OrbitDB not initialized');
  }

  if (!programs) {
    await getAllDatabases();
    if (!programs)
      return Promise.reject('Programs database not initialized');
  }

  let accessController = {};

  switch (permissions) {
    case 'public':
      accessController = { write: [ '*' ] }
      break
    default:
      accessController = { write: [ orbitdb.identity.id ] }
      break
  }

  let db = null;

  switch (type) {
    case DBType.keyvalue:
      db = await orbitdb.keyvalue(name, { accessController });
      break;
    case DBType.counter:
      db = await orbitdb.counter(name, { accessController });
      break;
    case DBType.feed:
      db = await orbitdb.feed(name, { accessController });
      break;
    case DBType.eventlog:
      db = await orbitdb.eventlog(name, { accessController });
      break;
    case DBType.docstore:
      db = await orbitdb.docstore(name, { accessController });
      break;
    default:
      throw new Error('Invalid database type');
  }

  const hash = programs.add({
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
  // return programs.remove(hash)
}
