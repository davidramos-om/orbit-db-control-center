import Store from "orbit-db-store";
import FeedStore from "orbit-db-feedstore";
import EventStore from "orbit-db-eventstore";
import KeyValueStore from "orbit-db-kvstore";
import DocumentStore from "orbit-db-docstore";
import CounterStore from "orbit-db-counterstore";

import { AddEntry as AddDocStoreEntry, queryEntries as fetchDocEntries, deleteEntry as delDocumentEntry } from "./docs-store";
import { addEntry as AddFeedStoreEntry, iterator as queryFeedEntries, deleteEntry as deleteFeedEntry } from "./feed-store";

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

export const fetchEntry = async (db: Store, likeMultiHashOrKey: string) => {

    await db.load();

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
};

export const fetchEntries = async (db: Store, options: fetchDbOptions = {
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
    await db.load();

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
};

export const addEntry = async (db: Store, options: addEntryOptions) => {

    const { pin, entry } = options || {};
    const key = Object.keys(entry)[ 0 ];
    const value = entry[ key ];

    if (db instanceof FeedStore)
        return AddFeedStoreEntry({
            store: db,
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
            store: db,
            entry,
            pin,
        });
    }

    if (db instanceof CounterStore)
        return db.inc(value);

    throw new Error('Database type not supported');
};

export const removeEntry = async (db: Store, likeMultiHashOrKey: string) => {

    if (db instanceof EventStore)
        throw new Error('Eventlog database does not support delete operation');

    if (db instanceof CounterStore)
        throw new Error('Counter database does not support delete operation');

    if (db instanceof FeedStore)
        return deleteFeedEntry({
            feedstore: db,
            hash: likeMultiHashOrKey
        });

    if (db instanceof DocumentStore)
        return delDocumentEntry({
            docstore: db,
            key: likeMultiHashOrKey
        });

    if (db instanceof KeyValueStore)
        return db.del(likeMultiHashOrKey, { pin: true });

    throw new Error('Database type not supported');
};
