
// import type DocStore from 'orbit-db-docstore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DocStore<T> = any;

interface AddDocEntryArgs {
    docstore: DocStore<any>;
    entry: any;
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

function validateParams(params: Record<string, any>) {

    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[ i ];
        if (!params[ key ])
            throw new Error(`${key} is required`);
    }
}

export async function AddEntry({ docstore, entry }: AddDocEntryArgs) {

    validateParams({ docstore, entry });
    const hash = await docstore.put(entry);
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
    const entries = docstore.query(mapper, options || {});
    return entries;
}

export function deleteEntry({ docstore, key }: GetDocEntryArgs) {

    validateParams({ docstore, key });
    const entry = docstore.del(key);
    return entry;
}