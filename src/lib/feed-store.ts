import type FeedStore from 'orbit-db-feedstore';
import { validateParams } from './helper';
import { IteratorQueryOptions } from './manage-entries';

import { getIPFS } from './db';
import { pinDataRemotely } from './manage-dbs';

//* More info on the FeedStore API: https://github.com/orbitdb/orbit-db/blob/main/API.md#orbitdbfeednameaddress

interface AddFeedEntryArgs {
    feedstore: FeedStore<any>;
    entry: any;
    pin: boolean;
}

export async function addEntry({ feedstore, entry, pin }: AddFeedEntryArgs) {

    validateParams({ feedstore, entry });

    //* type is not updated, add mehtod support options : {} parameter
    const hash = await (feedstore as any).add(entry, { pin });

    if (pin) {
        const ipfs = getIPFS();
        if (!ipfs)
            throw new Error('IPFS not initialized');

        const cid = await ipfs.pin.add(hash);
        await pinDataRemotely(cid);
    }

    return hash;
}

interface GetFeedEntryArgs {
    feedstore: FeedStore<any>;
    hash: string;
    fullOp: boolean
}

export function getEntryFromHash({ feedstore, hash, fullOp }: GetFeedEntryArgs) {

    validateParams({ feedstore, hash });
    const entry = feedstore.get(hash);

    if (fullOp)
        return entry.payload.value;

    return entry;
}

type iteratorArgs = {
    feedstore: FeedStore<any>;
    fullOp?: boolean;
    query: IteratorQueryOptions
}

export function iterator({ feedstore, query, fullOp }: iteratorArgs) {

    validateParams({ feedstore });

    const entries = feedstore.iterator(query || {})
        .collect()
        .map(l => {

            if (fullOp)
                return l;

            return l.payload.value;
        });

    return entries;
}

interface DeleteFeedEntryArgs {
    feedstore: FeedStore<any>;
    hash: string;
}

export function deleteEntry({ feedstore, hash }: DeleteFeedEntryArgs) {

    validateParams({ feedstore, hash });
    const entry = feedstore.remove(hash);
    return entry;
}