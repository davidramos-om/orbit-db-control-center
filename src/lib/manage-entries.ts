import { AddEntry as AddDocStoreEntry, queryEntries as fetchDocEntries, deleteEntry as delDocumentEntry } from "./docs-store";
import { addEntry as AddFeedStoreEntry, iterator as queryFeedEntries, deleteEntry as deleteFeedEntry } from "./feed-store";
import { getOneDatabase } from "./manage-dbs";
import { OrbitDbInstance } from "./types";


//* TYPES *//
export type addEntryOptions = {
    pin: boolean;
    entry: Record<string, any>;
}

export type IteratorQueryOptions = {
    limit?: number;
    lte?: string;
    lt?: string;
    gte?: string;
    gt?: string;
    reverse?: boolean;
}


export type fetchDbOptions = {
    dbInstance?: OrbitDbInstance;
    query?: IteratorQueryOptions;
    docsOptions?: {
        fullOp: boolean;
    }
}


//** ENTRY MANAGER **//

export const fetchEntry = async (address: string, likeMultiHashOrKey: string) => {

    const db = await getOneDatabase(address);
    if (!db)
        return null;

    switch (db.type) {
        case 'feed':
            return await db.get(likeMultiHashOrKey);
        case 'eventlog':
            return await db.get(likeMultiHashOrKey);
        case 'docstore':
            return await db.get(likeMultiHashOrKey);
        case 'keyvalue':
            return await db.get(likeMultiHashOrKey);
        case 'counter':
            return db.value || 0;
        default:
            return null;
    }
};

export const fetchEntries = async (
    address: string,
    options: fetchDbOptions = {
        dbInstance: null,
        docsOptions: {
            fullOp: false
        },
        query: {
            limit: 10,
            gt: '',
            gte: '',
            lt: '',
            lte: '',
            reverse: true
        }
    }) => {

    const { dbInstance, docsOptions, query } = options;
    const { fullOp = false } = docsOptions || {};

    const db_promise = dbInstance ? new Promise((resolve) => resolve(dbInstance)) : getOneDatabase(address);
    const db = await db_promise;
    if (!db)
        return null;

    switch (db.type) {
        case 'feed':
            return queryFeedEntries({
                feedstore: db,
                fullOp: fullOp,
                query: query || { limit: 1 }
            });
        case 'eventlog':
            const _entries = await db.iterator(query).collect();
            return _entries;
        case 'docstore':
            return fetchDocEntries({
                docstore: db,
                mapper: (e: any) => e !== null,
                options: {
                    fullOp: fullOp
                }
            });
        case 'keyvalue':
            const all = await db.all;
            return Object.keys(all).map(e => ({ payload: { key: e, value: db.get(e) } }));
        case 'counter':
            return db.value || 0;
        default:
            return null;
    }
};

export const addEntry = async (address: string, options: addEntryOptions) => {

    const db = await getOneDatabase(address);
    if (!db)
        return null;

    const { pin = false, entry } = options || {};
    const key = Object.keys(entry)[ 0 ];
    const value = entry[ key ];

    switch (db.type) {
        case 'feed':
            return AddFeedStoreEntry({
                feedstore: db,
                entry,
                pin,
            });
        case 'eventlog':
            return db.add(entry, { pin });
        case 'docstore':
            return AddDocStoreEntry({
                docstore: db,
                entry,
                pin,
            });
        case 'keyvalue':

            if (!entry.key)
                return Promise.reject('Key is required for keyvalue database');
            const theKey = entry.key;
            const _entry = { ...entry };
            delete _entry[ 'key' ];
            return db.put(theKey, _entry);
        case 'counter':
            return db.inc(value);
        default:
            return null;
    }
};

export const removeEntry = async (address: string, likeMultiHashOrKey: string) => {

    const db = await getOneDatabase(address);
    if (!db)
        throw new Error('Database not found');

    switch (db.type) {
        case 'feed':
            return deleteFeedEntry({
                feedstore: db,
                hash: likeMultiHashOrKey
            });

        case 'eventlog':
            throw new Error('Eventlog database does not support delete operation');
        case 'docstore':
            return delDocumentEntry({
                docstore: db,
                key: likeMultiHashOrKey
            });
        case 'keyvalue':
            return db.del(likeMultiHashOrKey);
        case 'counter':
            throw new Error('Counter database does not support delete operation');
        default:
            throw new Error('Database type not supported');
    }
};
