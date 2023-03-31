import { v4 } from 'uuid';

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

export function v4Id(): string {
    return v4();
}

export function sentenseCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValidJson(str: string): boolean {
    try {

        //validate using regex
        if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\/bfnrtu]/g, '@')
            .replace(/["'][^"'\\\n\r]*["']|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            return true;
        }

        //validate json
        JSON.parse(str);

    } catch (e) {
        return false;
    }

    return true;
}

export function prettyJson(json: string) {

    try {
        if (!isValidJson(json))
            return json;

        return JSON.stringify(JSON.parse(json), null, 2);
    } catch (error) {

        return json;
    }
}

export function prettyJsonOnInput(json: string) {

    //add a format to the string so it can be shown in the input field
    json = json.replace(/,/g, ', ');
    json = json.replace(/:/g, ': ');
    json = json.replace(/{/g, '{ ');
    json = json.replace(/}/g, ' }');
    json = json.replace(/\[/g, '[ ');
    json = json.replace(/\]/g, ' ]');
    json = json.replace(/"/g, '"');
    json = json.replace(/'/g, "'");
    json = json.replace(/\\/g, '\\');

    return json;
}