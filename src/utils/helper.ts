export function isValidOrbitPublicKey(key: string): boolean {

    if (typeof key !== 'string')
        return false;

    if (!key)
        return false;

    // string must be 130 characters long
    if (key.length !== 130)
        return false;

    // string must be hex
    const hex = /^[0-9a-fA-F]+$/;
    if (!hex.test(key.substring(2))) {
        return false;
    }

    return true;
}