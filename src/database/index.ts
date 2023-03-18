// import { create } from 'ipfs-core'
import * as IPFS from 'ipfs-core'
// import { create } from 'ipfs';

//ts-ignore
import OrbitDB from 'orbit-db';

import config from 'src/config';
import { DBPermission, DBType } from "src/types/orbitdb";

//* OrbitDB instance
let orbitdb: any = null;

//* Databases
let programs: any = null;


//* Start IPFS
export const initIPFS = async () => {
  // return IPFS.create(Config.ipfs)
  try {
    return await IPFS.create(config.ipfs)
  } catch (error) {
    console.error(`🐛  -> 🔥 :  initIPFS 🔥 :  error:`, error)
  }
}

//* Start OrbitDB
export const initOrbitDB = async (ipfs: any) => {
  orbitdb = await OrbitDB.createInstance(ipfs);
  // console.log(`🐛  -> 🔥 :  initOrbitDB 🔥 :  orbitdb:`, orbitdb);
  return orbitdb
}

export const getAllDatabases = async () => {

  // if (!programs && orbitdb) {

  //   // Load programs database
  //   programs = await orbitdb.feed('network.programs', {
  //     accessController: { write: [ orbitdb.identity.id ] },
  //     create: true
  //   });

  //   await programs.load()
  // }

  // return programs
  //   ? programs.iterator({ limit: -1 }).collect()
  //   : []
}

export const getDB = async (address: string) => {

  // let db = null;
  // if (orbitdb) {
  //   db = await orbitdb.open(address)
  //   await db.load()
  // }

  // return db
}

export const addDatabase = async (address: string) => {
  // const db = await orbitdb.open(address)
  // return programs.add({
  //   name: db.dbname,
  //   type: db.type,
  //   address: address,
  //   added: Date.now()
  // })
}

export const createDatabase = async (name: string, type: DBType, permissions: DBPermission) => {

  if (!orbitdb)
    return Promise.reject('OrbitDB not initialized');


  let accessController = {};

  switch (permissions) {
    case 'public':
      accessController = { write: [ '*' ] }
      break
    default:
      accessController = { write: [ orbitdb.identity.id ] }
      break
  }

  const db = await orbitdb.create(name, type, { accessController })

  return programs.add({
    name,
    type,
    address: db.address.toString(),
    added: Date.now()
  })
}

export const removeDatabase = async (hash: string) => {
  // return programs.remove(hash)
}
