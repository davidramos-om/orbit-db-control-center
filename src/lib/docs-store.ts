import type DocStore from 'orbit-db-docstore';
import { validateParams } from './helper';

//* More info on the DocsStore API: https://github.com/orbitdb/orbit-db-docstore#readme

interface AddDocEntryArgs {
    store: DocStore<any>;
    entry: any;
    pin: boolean;
}

interface GetDocEntryArgs {
    docstore: DocStore<any>;
    key: string;
}

interface QueryDocEntryArgs {
    docstore: DocStore<any>;
    mapper: (entry: any) => boolean;
    options?: {
        fullOp?: boolean;
    }
}

export async function AddEntry({ store: docstore, entry, pin }: AddDocEntryArgs) {
    validateParams({ docstore, entry });
    const hash = await (docstore as any).put(entry, { pin });
    return hash;
}

export function getEntryFromHash({ docstore, key }: GetDocEntryArgs) {

    validateParams({ docstore, key });
    const entry = docstore.get(key);
    return entry;
}

export function fetchDocEntries({ docstore, key }: GetDocEntryArgs) {

    validateParams({ docstore });
    const entries = docstore.get(key);
    return entries;
}

export function queryEntries({ docstore, options, mapper }: QueryDocEntryArgs) {

    validateParams({ docstore, mapper });
    const entries = (docstore as any).query(mapper, options || {});
    return entries;
}

export function deleteEntry({ docstore, key }: GetDocEntryArgs) {

    validateParams({ docstore, key });
    const entry = docstore.del(key);
    return entry;
}