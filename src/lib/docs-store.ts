

interface AddDocEntryArgs {
    docstore: any;
    id: string;
    entry: Record<string, any>;
}

interface GetDocEntryArgs {
    docstore: any;
    key: string;
}

interface QueryDocEntryArgs {
    docstore: any;
    mapper: (entry: any) => boolean;
}

function validateParams(params: Record<string, any>) {

    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[ i ];
        if (!params[ key ])
            throw new Error(`${key} is required`);
    }
}

export async function AddEntry({ docstore, id, entry }: AddDocEntryArgs) {

    validateParams({ docstore, id, entry });

    const json = JSON.stringify(entry);
    const hash = await docstore.put(json, id);

    return hash;
}

export function getEntryFromHash({ docstore, key }: GetDocEntryArgs) {

    validateParams({ docstore, key });

    const entry = docstore.get(key);

    return entry;
}

export function queryEntries({ docstore, mapper }: QueryDocEntryArgs) {

    validateParams({ docstore, mapper });

    const entries = docstore.query(mapper);

    return entries;
}

export function deleteEntry({ docstore, key }: GetDocEntryArgs) {

    validateParams({ docstore, key });

    const entry = docstore.del(key);

    return entry;
}