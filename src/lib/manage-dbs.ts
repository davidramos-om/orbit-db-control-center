import { DBPermission, DBType } from "./types";
import { OrbitDbInstance } from './types';
import { initOrbitDB, getInstances } from "./db";
import { getAllPrograms } from "./manage-programs";

//** DATABASE MANAGER **//

export const getOneDatabase = async (address: string): Promise<OrbitDbInstance | null> => {

    const { orbitdb } = getInstances();
    let db: OrbitDbInstance = null;
    if (orbitdb) {
        db = await orbitdb.open(address);
        await db.load();
    }

    if (db)
        return db as OrbitDbInstance;

    return db;
};

export const addDatabase = async (address: string): Promise<{ db: OrbitDbInstance; hash: string; }> => {

    const { orbitdb, program } = getInstances();

    if (!orbitdb)
        return Promise.reject('OrbitDB not initialized');

    if (!program)
        return Promise.reject('Programs database not initialized');

    const db = await orbitdb.open(address);

    const hash = await program.add({
        name: db.dbname,
        type: db.type,
        address: address,
        added: Date.now()
    });


    return {
        db: db as OrbitDbInstance,
        hash
    };
};

export const createDatabase = async (
    {
        name, type, permissions
    }: {
        name: string;
        type: DBType;
        permissions: DBPermission;
    }
): Promise<{
    db: OrbitDbInstance;
    hash: string;
}> => {

    const { orbitdb, program, ipfs } = getInstances();

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
            accessController = { write: [ '*' ] };
            break;
        default:
            accessController = {
                write: [
                    // Give write access to ourselves
                    orbitdb.identity.id
                ]
            };
            break;
    }

    const options = {
        // Setup write access
        accessController,
    };

    let db: OrbitDbInstance = null;

    switch (type) {
        case DBType.keyvalue:
            db = await orbitdb.keyvalue(name, options);
            break;
        case DBType.counter:
            db = await orbitdb.counter(name, options);
            break;
        case DBType.feed:
            db = await orbitdb.feed(name, options);
            break;
        case DBType.eventlog:
            db = await orbitdb.eventlog(name, options);
            break;
        case DBType.docstore:
            db = await orbitdb.docstore(name, options);
            break;
        default:
            throw new Error('Invalid database type');
    }

    const hash = await program.add({
        name,
        type,
        address: db.address.toString(),
        added: Date.now()
    });

    return {
        db: db as OrbitDbInstance,
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
