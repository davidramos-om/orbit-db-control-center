import { CID } from "multiformats";
import Store from "orbit-db-store";
import Identities from 'orbit-db-identity-provider'

import { DBPermission, DBType, DataBaseInstance } from "./types";
import { parseOrbitDbAddress } from "./helper";
import { initOrbitDB, getInstances } from "./db";
import { getAllPrograms } from "./manage-programs";
import { addRemotePins } from "./manage-ipfs";


//** DATABASE MANAGER **//

//creat a hash of the database address that as been opened
const OpenedDBs: { [ key: string ]: Store } = {};

export function clearOpenedDBs() {

    for (const key in OpenedDBs) {
        const db = OpenedDBs[ key ];
        db.close();
    }

    Object.keys(OpenedDBs).forEach(key => delete OpenedDBs[ key ]);
}

export const getOneDatabase = async ({ address, load = false, onReplicate, onReady, onWrite }: {
    address: string;
    load: boolean,
    onReplicate?: () => void;
    onReady?: () => void;
    onWrite?: (address: any, entry: any, heads: any) => void;
}): Promise<Store | null> => {

    if (!address)
        return null;

    const { orbitdb } = getInstances();
    if (!orbitdb)
        throw new Error('OrbitDB not initialized');

    console.log('getOneDatabase', { OpenedDBs });
    if (OpenedDBs[ address ])
        return OpenedDBs[ address ];

    let db: Store | null = null;
    if (orbitdb) {
        db = await orbitdb.open(address, {
            localOnly: false, //* load from local storage
            create: false, //* create if doesn't exist
            overwrite: false, //* overwrite if exists
            replicate: true, //* replicate across peers            
        });

        if (db) {

            OpenedDBs[ address ] = db;

            if (onReplicate)
                db.events.on('replicated', onReplicate);

            if (onReady)
                db.events.on('ready', onReady);

            if (onWrite)
                db.events.on('write', onWrite);
        }

        if (db && load)
            await db.load();
    }

    return db;
};


export const connectToDb = async (address: string): Promise<{ db: Store; hash: string; }> => {

    const { orbitdb, program } = getInstances();

    if (!orbitdb)
        return Promise.reject('OrbitDB not initialized');

    if (!program)
        return Promise.reject('Programs database not initialized');

    const db = await getOneDatabase({
        address,
        load: false,
    });

    if (!db)
        return Promise.reject('Database not found');

    const hash = await program.add({
        name: (db as any).dbname,
        type: db.type,
        address: address,
        added: Date.now()
    });

    return {
        db: db,
        hash
    };
};

export const createDatabase = async (
    {
        name: dbName, type, permissions, access
    }: {
        name: string;
        type: DBType;
        permissions: DBPermission;
        access: string[]
    }
): Promise<{
    db: DataBaseInstance<unknown>;
    hash: string;
}> => {

    const { orbitdb, program, ipfs } = getInstances();
    console.log(`🐛  -> 🔥 :  orbitdb:`, orbitdb);


    if (!ipfs)
        return Promise.reject('IPFS not initialized');

    if (!orbitdb) {
        await initOrbitDB(ipfs);
        if (!orbitdb)
            return Promise.reject('OrbitDB not initialized');
    }

    if (!program) {
        await getAllPrograms();
        if (!program)
            return Promise.reject('Programs database not initialized');
    }

    let accessController = {};

    switch (permissions) {
        case 'public':
            accessController = {
                type: 'orbitdb',
                write: [ '*' ]
            };
            break;
        default:

            let write = [ ...access ];
            const myId = (orbitdb as any).identity.id;

            if (!write.includes(myId))
                write = [ ...access, myId ];

            accessController = {
                type: 'orbitdb',
                write: write
            };
            break;
    }

    const options: IStoreOptions = {
        accessController,
        localOnly: false, //* load from local storage
        create: true, //* create if doesn't exist
        overwrite: false, //* overwrite if exists
        replicate: true, //* replicate across peers
        directory: './orbitdb',
        type: type
    };

    let db: DataBaseInstance<unknown> | null = null;
    switch (type) {
        case DBType.keyvalue:
            db = await orbitdb.keyvalue(dbName, options);
            break;
        case DBType.counter:
            db = await orbitdb.counter(dbName, options);
            break;
        case DBType.feed:
            db = await orbitdb.feed(dbName, options);
            break;
        case DBType.eventlog:
            db = await orbitdb.eventlog(dbName, options);
            break;
        case DBType.docstore:
            db = await orbitdb.docstore(dbName, options);
            break;
        default:
            throw new Error('Invalid database type');
    }

    // const identity = await (orbitdb as any).identity.createIdentity();
    const optionsIdentity = { id: (orbitdb as any).identity.id };
    const identity = await Identities.createIdentity(optionsIdentity)

    db.setIdentity(identity);
    await db.load()

    const hash = await program.add({
        name: dbName,
        type,
        address: db.address.toString(),
        added: Date.now()
    });

    return {
        db: db,
        hash
    };
};

export const removeDatabase = async (hash: string) => {

    const { program } = getInstances();
    if (!program)
        return Promise.reject('Program database not initialized');

    const db = program.iterator({ limit: -1 }).collect().find((db: any) => db.hash === hash);
    if (db) {
        await program.remove(db.hash);
        return true;
    }

    return false;
};


export function pinData(dbAddress: string) {

    const { ipfs } = getInstances();
    if (!ipfs)
        throw new Error('IPFS not initialized');

    const { cid } = parseOrbitDbAddress(dbAddress) || {};
    if (!cid)
        throw new Error('Invalid database address');

    return ipfs.pin.add(cid, {
        timeout: 10000,
        recursive: true,
        preload: true,
        // lock: true,
        signal: undefined
    });
}

export async function pinDataRemotely(cid: CID) {

    const { ipfs } = getInstances();
    if (!ipfs)
        throw new Error('IPFS not initialized');

    const SERVICE = 'pinata';
    // const ENDPOINT = 'https://api.pinata.cloud';
    // const KEY = '4c821c02e3e0fd570f343f05713ef54fbcb7649f3c2c6d61893ac44eea52f569';

    // await registerServiceIfNot(ipfs, {
    //     name: SERVICE,
    //     endpoint: new URL(ENDPOINT),
    //     key: KEY
    // });

    return await addRemotePins(ipfs, SERVICE, [ cid ]);

    // const isRegisted = await isServiceRegistered(ipfs, SERVICE);

    // if (!isRegisted) {
    //     await ipfs.pin.remote.service.add(SERVICE, {
    //         endpoint: new URL(ENDPOINT),
    //         key: KEY
    //     });
    // }

    // return ipfs.pin.remote.add(cid, {
    //     service: 'pinata',
    //     timeout: 30000
    // });

    // const credentials: Credentials = {
    //     endpoint: new URL('https://api.pinata.cloud'),
    //     key: '4c821c02e3e0fd570f343f05713ef54fbcb7649f3c2c6d61893ac44eea52f569',
    // };

    // return ipfs.pin.remote.service.add('pinata', credentials)
    //     .then(() => ipfs.pin.remote.add(cid, { service: 'pinata' }));

}


/**
 Remove db locally, does not delete data from peers
*/
export async function dropDb(dbAddress: string) {

    const db = await getOneDatabase({ address: dbAddress, load: false })
    if (!db)
        throw new Error('Database not found');

    db.drop();
}


/**
 Close the database and remove it from the registry
*/
export async function closeDb(dbAddress: string) {

    const db = await getOneDatabase({ address: dbAddress, load: false });
    if (!db)
        throw new Error('Database not found');

    db.close();
}



export async function grantAccess(dbAddress: string, IdentityIds: string[]) {

    const { ipfs, orbitdb } = getInstances();
    if (!ipfs)
        throw new Error('IPFS not initialized');

    if (!orbitdb)
        throw new Error('OrbitDB not initialized');

    let db = await getOneDatabase({ address: dbAddress, load: false });
    if (!db)
        throw new Error('Database not found');


    const dbAny = db as any;
    db = await orbitdb.eventlog(dbAny.dbname, {
        accessController: {
            type: 'orbitdb', //OrbitDBAccessController
            write: [ db.identity.id ]
        }
    });

    const currentAccess = dbAny.access?.write?.map((p: any) => String(p)) || [];
    const newAccess = currentAccess.concat(IdentityIds.filter((id) => !currentAccess.includes(String(id))));

    for (const id of newAccess) {
        await dbAny.access.grant('write', id);
    }
}
