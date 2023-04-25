import OrbitDB from 'orbit-db';
import { CID } from 'multiformats/cid';

export function validateParams(params: Record<string, any>) {

    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[ i ];
        if (!params[ key ])
            throw new Error(`${key} is required`);
    }
}

export function isValidDbAddress(address: string) {

    if (address && address.startsWith('/orbitdb')) {

        const parts = address.split('/');
        const vAddress = OrbitDB.isValidAddress(address);
        if (!vAddress)
            return false;

        const id = parts[ 2 ];
        if (id && (id.toLowerCase().startsWith('qm') && id.toLowerCase().startsWith('zd')))
            return false;

        const vId = Boolean(id) && id.length > 0;
        const vName = Boolean(parts[ 3 ]) && parts[ 3 ].length > 0;        
        return vName && vId;
    }

    return false;
}

export function parseOrbitDbAddress(address: string) {

    if (isValidDbAddress(address)) {

        const parts = address.split('/');
        return {
            protocol: parts[ 1 ],
            cid: parts[ 2 ],
            name: parts[ 3 ],
        };
    }

    return null;
}


export function decodeCID(bafyCidString: string) {

    if (!bafyCidString)
        return null;

    const pcid = CID.parse(bafyCidString)

    return {
        cid: pcid.toString(),
        codec: pcid.code,
        version: pcid.version,
        multihash: pcid.multihash
    }
}
