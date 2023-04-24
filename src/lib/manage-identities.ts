import Identities, { type Identity, type StaticCreateIdentityOptions } from 'orbit-db-identity-provider'


export async function createIdentity(options: StaticCreateIdentityOptions): Promise<Identity> {
    return Identities.createIdentity(options)
}

export function verifyIdentity(identity: Identity): Promise<boolean> {
    return Identities.verifyIdentity(identity)
}
