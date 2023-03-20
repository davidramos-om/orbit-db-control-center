export enum DBType {
    feed = 'feed',
    eventlog = 'eventlog',
    keyvalue = 'keyvalue',
    docstore = 'docs',
    counter = 'counter'
};

export const DbTypeExtendedDescription = [ {
    type: DBType.feed,
    description: 'A feed is a log of entries, append-only, ordered by time'
},
{
    type: DBType.eventlog,
    description: 'Inmutable Log'
},
{
    type: DBType.keyvalue,
    description: 'A key-value store'
},
{
    type: DBType.docstore,
    description: 'A document store, support for JSON documents'
},
{
    type: DBType.counter,
    description: 'Counter (CRDT)'
}
]

export enum DBPermission {
    public = 'public',
    private = 'private'
}

export const DBPermissionExtendedDescription = [ {
    type: DBPermission.public,
    description: 'Anyone can read and write'
}, {
    type: DBPermission.private,
    description: 'Creator-only : only you can write, anyone can read'
} ]

export interface DBEntry {
    id: string;
    hash: string;
    sig: string;
    key: string;
    v: number;
    next: string[];
    clock: {
        id: string;
        time: number;
    },
    identity: {
        id: string;
        publicKey: string;
        type: string;
        signatures: {
            id: string;
            publicKey: string;
        }
    },
    payload: {
        op: string;
        key: string;
        value: {
            name: string;
            type: DBType;
            address: string;
            added: number;
        }
    }
};

export enum SystemState {
    connecting = 'connecting',
    connected = 'connected',
    disconnected = 'disconnected',
    error = 'error'
}