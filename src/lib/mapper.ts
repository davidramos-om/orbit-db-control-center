
import { DBEntry, OrbitDbProgram } from './types';

export function MapOrbitDbEntry(db: any | OrbitDbProgram): DBEntry {


    return {
        id: db?.id || '',
        hash: db?.hash || '',
        key: db?.key || '',
        sig: db?.sig || '',
        v: db?.v || 0,
        clock: {
            id: db?.clock?.id || '',
            time: db?.clock?.time || 0
        },
        next: db?.next?.length ? db?.next : [],
        identity: {

            //* Id of external identity provider, default is 'orbitdb' if not set
            id: db?.identity?.id || '',

            //* The signing key used to sign the db entries
            publicKey: db?.identity?.publicKey || '',


            //* orbitdb identity type, default is 'orbitdb' is not set, could be 'ethereum', if identity is signed by an ethereum address
            type: db?.identity?.type || '',

            signatures: {

                //* The signature of the identity.id signed by the identity.publicKey, allows the owner to prove they own the identity.publicKey
                id: db?.identity?.signatures?.id || '',

                //* Created by signing the concatenation : {identity.signature.id + identity.publicKey} using identity.id.
                publicKey: db?.identity?.signatures?.publicKey || ''
            }
        },
        payload: {
            // * 
            key: db?.payload?.key || '',
            op: db?.payload?.op || '',
            value: {

                //* timestamp
                added: db?.payload?.value?.added || 0,

                //* orbitdb address
                address: db?.payload?.value?.address || '',

                //* database name
                name: db?.payload?.value?.name || '',

                //* database type
                type: db?.payload?.value?.type || ''
            }
        }
    }
}