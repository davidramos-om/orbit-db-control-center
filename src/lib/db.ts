import OrbitDB from 'orbit-db';
import type FeedStore from "orbit-db-feedstore";
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

  if (!programs && orbitdb) {

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

  // const db = await orbitdb.create(name, type, { accessController })

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
