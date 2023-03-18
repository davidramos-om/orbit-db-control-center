export enum DBType {
    feed = 'feed',
    eventlog = 'eventlog',
    keyvalue = 'keyvalue',
    docstore = 'docstore',
    counter = 'counter'
};

export enum DBPermission {
    public = 'public',
    private = 'private'
}

export interface DBEntry {
    name: string;
    type: DBType;
    address: string;
    added: number;
};