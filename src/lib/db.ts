import OrbitDB from 'orbit-db';
import { type IPFS, create as createIPFSInstance } from 'ipfs-core';
import ipfsConfig from './ipfs-config'
import { OrbitDbProgram } from "./types";

let orbitdb: OrbitDB | null = null; //* OrbitDB instance
let program: OrbitDbProgram | null = null; //* Programs database

//* Pinning node
let ipfs_pinningNode: IPFS | null = null;
let starting_ipfs = false;

export function setProgream(_program: any) {
  program = _program;
}

export function getProgram() {
  return program;
}

export async function loadProgram() {
  if (program)
    await program.load();
}

export function getOrbitDB(): OrbitDB | null {
  return orbitdb;
}

export function getIPFS() {
  return ipfs_pinningNode;
}

export function getInstances() {
  return { ipfs: ipfs_pinningNode, orbitdb, program };
}

export function peerId() {

  if (!orbitdb)
    return (orbitdb as any).identity.id;

  return null;
}

export const initIPFS = async () => {

  try {

    if (ipfs_pinningNode)
      return ipfs_pinningNode;

    if (starting_ipfs)
      return null;

    starting_ipfs = true;
    ipfs_pinningNode = await createIPFSInstance(ipfsConfig);

    starting_ipfs = false;


    return ipfs_pinningNode
  }
  catch (error) {
    starting_ipfs = false;
    throw error;
  }
  finally {
    starting_ipfs = false;
  }
}

export const initOrbitDB = async (ipfs: IPFS) => {

  if (orbitdb)
    return orbitdb;

  orbitdb = await OrbitDB.createInstance(ipfs, {
    directory: './orbitdb',
  });

  return orbitdb;
}

export const initPrograms = async () => {

  if (program)
    return program as OrbitDbProgram;

  const orbitdb = getOrbitDB();
  if (!orbitdb)
    throw new Error('OrbitDB not initialized');


  program = await orbitdb.feed('network.programs', {
    accessController: {
      write: [ (orbitdb as any).identity.id ]
    },
    create: true
  });

  await program.load();

  return program as OrbitDbProgram;
}


export function initDbSystem(): Promise<{ ipfs: IPFS, orbitdb: OrbitDB }> {

  return new Promise(async (resolve, reject) => {

    try {

      const ifps = await initIPFS();

      if (ifps) {
        const db = await initOrbitDB(ifps);
        if (!db)
          reject('OrbitDB not initialized');

        const progs = await initPrograms();
        if (!progs)
          reject('Programs database not initialized');

        resolve({
          ipfs: ifps,
          orbitdb: db
        });
      }
      else {
        reject('IPFS not initialized');
      }
    }
    catch (e) {
      reject(e);
    }
  });
}

/**
 Close databases, connections, pubsub and reset orbitdb state.
*/
export async function disconnectInstance() {

  const orbit = getOrbitDB();
  if (!orbit)
    throw new Error('OrbitDB not initialized');

  orbit.disconnect();
}

