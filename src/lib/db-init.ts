import { type IPFS } from "ipfs-core";
import type OrbitDB from "orbit-db";

import { initIPFS, initOrbitDB } from './db';

export function initDbSystem(): Promise<{ ipfs: IPFS, orbitdb: OrbitDB }> {

    return new Promise(async (resolve, reject) => {

        try {

            const ifps = await initIPFS();

            if (ifps) {
                const db = await initOrbitDB(ifps);
                if (!db)
                    reject('OrbitDB not initialized');

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