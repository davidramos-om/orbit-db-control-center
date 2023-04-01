import OrbitDB from 'orbit-db';

export function validateParams(params: Record<string, any>) {

    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[ i ];
        if (!params[ key ])
            throw new Error(`${key} is required`);
    }
}

export function isValidDbAddress(address: string) {

    if (address && address.startsWith('orbitdb')) {
        const parts = address.split('/');

        const vAddress = OrbitDB.isValidAddress(address);
        if (!vAddress)
            return false;

        const type = parts[ 2 ];
        if (OrbitDB.databaseTypes.indexOf(type) === -1)
            return false;

        const vName = parts[ 3 ] && parts[ 3 ].length > 0;
        const vId = parts[ 4 ] && parts[ 4 ].length > 0;

        return vName && vId;
    }

    return false;
}