import OrbitDB from 'orbit-db';
import { type IPFS, create as createIPFSInstance } from 'ipfs-core';

import config from './ipfs-config'
import { OrbitDbProgram } from "./types";

let orbitdb: any | null = null; //* OrbitDB instance
let program: OrbitDbProgram | null = null; //* Programs database
let ipfs: IPFS | null = null; //* IPFS instance

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

export function getOrbitDB() {
  return orbitdb;
}

export function getIPFS() {
  return ipfs;
}

export function getInstances() {
  return { ipfs, orbitdb, program };
}

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

export const initPrograms = async () => {

  if (program)
    return program as OrbitDbProgram;

  const orbitdb = getOrbitDB();
  if (!orbitdb)
    throw new Error('OrbitDB not initialized');

  program = await orbitdb.feed('network.programs', {
      accessController: { write: [ orbitdb.identity.id ] },
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
          ipfs: ifps as IPFS,
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


