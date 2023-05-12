import OrbitDB from 'orbit-db';
import { type IPFS, create as createIPFSInstance } from 'ipfs-core';
import ipfsConfig from './ipfs-config'
import { OrbitDbProgram } from "./types";

let orbitdb: OrbitDB | null = null; //* OrbitDB instance
let program: OrbitDbProgram<unknown> | null = null; //* Programs database

//* Pinning node
let ipfs_pinningNode: IPFS | null = null;
let starting_ipfs = false;

export function setProgream(_program: OrbitDbProgram<unknown> | null) {
  program = _program;
}

export function getProgram() {
  return program;
}

export async function loadProgram() {
  if (program)
    await program.load();
}

export function setOrbitDB(_orbitdb: OrbitDB | null) {
  orbitdb = _orbitdb;
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

  const _orbitdb = await OrbitDB.createInstance(ipfs as any, {
    directory: './orbitdb',
  });

  setOrbitDB(_orbitdb);
  return orbitdb;
}

export const initPrograms = async () => {

  if (program)
    return program;

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

  return program;
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

