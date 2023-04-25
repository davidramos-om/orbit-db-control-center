import FeedStore from "orbit-db-feedstore";
import EventStore from "orbit-db-eventstore";
import KeyValueStore from "orbit-db-kvstore";
import DocumentStore from "orbit-db-docstore";
import CounterStore from "orbit-db-counterstore";

import { AddEntry as AddDocStoreEntry, queryEntries as fetchDocEntries, deleteEntry as delDocumentEntry } from "./docs-store";
import { addEntry as AddFeedStoreEntry, iterator as queryFeedEntries, deleteEntry as deleteFeedEntry } from "./feed-store";
import { getOneDatabase } from "./manage-dbs";

//* params *//
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
    query?: IteratorQueryOptions;
    docsOptions?: {
        fullOp: boolean;
    }
}


//** ENTRY MANAGER **//

export const fetchEntry = async (address: string, likeMultiHashOrKey: string) => {

    const db = await getOneDatabase({ address, load: true });
    if (!db)
        throw new Error('Database not found');

    if (db instanceof FeedStore)
        return db.get(likeMultiHashOrKey);

    if (db instanceof EventStore)
        return db.get(likeMultiHashOrKey);

    if (db instanceof DocumentStore)
        return db.get(likeMultiHashOrKey);

    if (db instanceof KeyValueStore)
        return db.get(likeMultiHashOrKey);

    if (db instanceof CounterStore)
        return db.value || 0;


    // switch (db.type) {
    //     case 'feed':
    //         return await db.get(likeMultiHashOrKey);
    //     case 'eventlog':
    //         return await db.get(likeMultiHashOrKey);
    //     case 'docstore':
    //         return await db.get(likeMultiHashOrKey);
    //     case 'keyvalue':
    //         return await db.get(likeMultiHashOrKey);
    //     case 'counter':
    //         return db.value || 0;
    //     default:
    //         return null;
    // }
};

export const fetchEntries = async (address: string, options: fetchDbOptions = {
    docsOptions: {
        fullOp: false
    },
    query: {
        limit: -1,
        gt: '',
        gte: '',
        lt: '',
        lte: '',
        reverse: true
    }
}) => {

    const { docsOptions, query } = options;
    const { fullOp = false } = docsOptions || {};

    const db = await getOneDatabase({ address, load: true });
    if (!db)
        throw new Error('Database not found');

    if (db instanceof FeedStore)
        return queryFeedEntries({
            feedstore: db,
            fullOp: fullOp,
            query: query || { limit: 1 }
        });

    if (db instanceof EventStore)
        return db.iterator(query).collect();

    if (db instanceof DocumentStore)
        return fetchDocEntries({
            docstore: db,
            mapper: (e: any) => e !== null,
            options: {
                fullOp: fullOp
            }
        });

    if (db instanceof KeyValueStore) {
        const all = db.all;
        return Object.keys(all).map(e => ({ payload: { key: e, value: db.get(e) } }));
    }

    if (db instanceof CounterStore)
        return db.value || 0;

    throw new Error('Invalid database type');

    // switch (db.type) {
    //     case 'feed':
    //         return queryFeedEntries({
    //             feedstore: db,
    //             fullOp: fullOp,
    //             query: query || { limit: 1 }
    //         });
    //     case 'eventlog':
    //         const _entries = await db.iterator(query).collect();
    //         return _entries;
    //     case 'docstore':
    //         return fetchDocEntries({
    //             docstore: db,
    //             mapper: (e: any) => e !== null,
    //             options: {
    //                 fullOp: fullOp
    //             }
    //         });
    //     case 'keyvalue':
    //         const all = await db.all;
    //         return Object.keys(all).map(e => ({ payload: { key: e, value: db.get(e) } }));
    //     case 'counter':
    //         return db.value || 0;
    //     default:
    //         return null;
    // }
};

export const addEntry = async (address: string, options: addEntryOptions) => {

    const db = await getOneDatabase({ address, load: false });
    if (!db)
        throw new Error('Database not found');

    const { pin, entry } = options || {};
    const key = Object.keys(entry)[ 0 ];
    const value = entry[ key ];

    if (db instanceof FeedStore)
        return AddFeedStoreEntry({
            feedstore: db,
            entry,
            pin,
        });

    if (db instanceof EventStore)
        return db.add(entry);

    if (db instanceof KeyValueStore) {

        if (!entry.key)
            return Promise.reject('Key is required for keyvalue database');

        const theKey = entry.key;
        const _entry = { ...entry };
        delete _entry[ 'key' ];
        return db.put(theKey, _entry, { pin, });
    }

    if (db instanceof DocumentStore) {
        return AddDocStoreEntry({
            docstore: db,
            entry,
            pin,
        });
    }

    if (db instanceof CounterStore)
        return db.inc(value);

    throw new Error('Database type not supported');
};

export const removeEntry = async (address: string, likeMultiHashOrKey: string) => {

    const db = await getOneDatabase({ address, load: false });
    if (!db)
        throw new Error('Database not found');

    if (db instanceof FeedStore)
        return deleteFeedEntry({
            feedstore: db,
            hash: likeMultiHashOrKey
        });

    if (db instanceof EventStore)
        throw new Error('Eventlog database does not support delete operation');

    if (db instanceof DocumentStore)
        return delDocumentEntry({
            docstore: db,
            key: likeMultiHashOrKey
        });

    if (db instanceof KeyValueStore)
        return db.del(likeMultiHashOrKey, { pin: true });

    if (db instanceof CounterStore)
        throw new Error('Counter database does not support delete operation');

    throw new Error('Database type not supported');
};
