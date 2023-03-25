import OrbitDB from 'orbit-db';
import { type IPFS, create as createIPFSInstance } from 'ipfs-core';

import config from './ipfs-config'
import { DBPermission, DBType } from "./types";


export let orbitdb: any | null = null; //* OrbitDB instance
export let programs: any | null = null; //* Programs database
export let ipfs: IPFS | null = null; //* IPFS instance

export const initIPFS = async () => {

  if (ipfs)
    return ipfs

  ipfs = await createIPFSInstance(config.ipfs);
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


type fetchDbOptions = {
  limit?: number;
  lte?: string;
  lt?: string;
  gte?: string;
  gt?: string;
  reverse?: boolean;
  docsOptions?: {
    fullOp: boolean;
  }
}

export const fetchDb = async (address: string, options: fetchDbOptions) => {

  const db = await getDB(address);
  console.log(`🐛  -> 🔥 :  fetchDb 🔥 :  db:`, db);

  if (!db)
    return null;

  const { limit = 10, reverse = true, docsOptions } = options || {};
  const { fullOp = false } = docsOptions || {};

  switch (db.type) {
    case 'feed':
      return db.iterator({ limit }).collect();
    case 'eventlog':
      return db.iterator({ limit }).collect();
    case 'docstore':
      return db.query((e: any) => e !== null, { fullOp: fullOp });
    case 'keyvalue':
      return Object.keys(db.all).map(e => ({ payload: { value: { key: e, value: db.get(e) } } }));
    case 'counter':
      return db.value || 0;
    default:
      return null;
  }
}

//add an options type, depending on the db type, the entry will be different, if type is keyvalue, entry will be { key: string, value: any }, if type is counter, entry must be a number, etc
type addEntryOptions = {
  pin: boolean;
  entry: Record<string, any>;
}


export const addEntry = async (address: string, options: addEntryOptions) => {

  const db = await getDB(address);
  if (!db)
    return null;

  //check if the entry is valid, depending on the db type
  const { pin = false, entry } = options || {};
  const { key, value } = entry || {};

  switch (db.type) {
    case 'feed':
      return db.put(key, value, { pin });
    case 'eventlog':
      return db.add(key, value, { pin });
    case 'docstore':
      return db.put(entry);
    case 'keyvalue':
      return db.put(entry.key, entry.value);
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
