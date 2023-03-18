import OrbitDB from 'orbit-db';
import * as IPFS from 'ipfs'

import config from 'src/config'
import { DBPermission, DBType } from "src/types/orbitdb";


let orbitdb: any = null; //* OrbitDB instance
let programs: any = null; //* Databases


export const initIPFS = async () => {
  console.log("initIPFS.initIPFS : ", (window as any).initIPFS)
  console.log("initIPFS.ipfs_instance : ", (window as any).ipfs_instance)
  return await IPFS.create(config.ipfs)
  return null;
}


export const initOrbitDB = async (ipfs: any) => {
  orbitdb = await OrbitDB.createInstance(ipfs);
  console.log(`🐛  -> 🔥 :  initOrbitDB 🔥 :  orbitdb:`, orbitdb);
  return orbitdb
}

export const getAllDatabases = async () => {

  if (!programs && orbitdb) {

    // Load programs database
    programs = await orbitdb.feed('network.programs', {
      accessController: { write: [ orbitdb.identity.id ] },
      create: true
    });

    await programs.load()
  }

  return programs
    ? programs.iterator({ limit: -1 }).collect()
    : []
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
  const db = await orbitdb.open(address)
  return programs.add({
    name: db.dbname,
    type: db.type,
    address: address,
    added: Date.now()
  })
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
