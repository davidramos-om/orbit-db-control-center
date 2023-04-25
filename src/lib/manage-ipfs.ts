import { type IPFS } from 'ipfs-core';
import { Status } from 'ipfs-core-types/src/pin/remote';
import drain from 'it-drain';
import { CID, Version } from "multiformats";
import PinataSDK from '@pinata/sdk';

const API_KEY = import.meta.env.VITE_API_KEY;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const clearPins = async (ipfs: IPFS) => {
    await drain(ipfs.pin.rmAll(ipfs.pin.ls({ type: 'recursive' })))
    await drain(ipfs.pin.rmAll(ipfs.pin.ls({ type: 'direct' })))
}

export const clearRemotePins = async (ipfs: IPFS) => {

    for (const { service } of await ipfs.pin.remote.service.ls()) {

        const cids = []
        const status: Status[] = [ 'queued', 'pinning', 'pinned', 'failed' ]

        for await (const pin of ipfs.pin.remote.ls({
            status: status,
            service
        })) {
            cids.push(pin.cid)
        }

        if (cids.length > 0) {
            await ipfs.pin.remote.rmAll({
                cid: cids,
                status,
                service
            })
        }
    }
}

export const addRemotePins = async (ipfs: IPFS, service: string, pins: CID<unknown, number, number, Version>[]) => {

    // const timeout = 5 * 60 * 1000;

    // const requests = [];

    // for (const [ name, cid ] of Object.entries(pins)) {

    //     requests.push(ipfs.pin.remote.add(cid, {
    //         name,
    //         service,
    //         background: true,
    //         timeout
    //     }));
    // }

    pinDataRemotely(pins[ 0 ].toString());
    // await Promise.all(requests)

    // const node = await _IFSP.create({
    //     repo: 'ipfs-' + Math.random(),
    // });

    // const data = 'Hello, <DRAMOS> TESTING IPFS!'

    // // add your data to IPFS - this can be a string, a Buffer,
    // // a stream of Buffers, etc
    // const results = await node.add(data, {
    //     pin: true,
    //     timeout: 5 * 60 * 1000,
    // });

    // // we loop over the results because 'add' supports multiple 
    // // additions, but we only added one entry here so we only see
    // // one log line in the output


    // const r2 = await ipfs.add(pins[ 0 ].toString(), {
    //     pin: true,
    //     timeout: 5 * 60 * 1000,
    // });
}


export const clearServices = async (ipfs: IPFS) => {
    const services = await ipfs.pin.remote.service.ls()
    await Promise.all(services.map(({ service }) => ipfs.pin.remote.service.rm(service)))
}

export async function isServiceRegistered(ipfs: IPFS, name: string) {
    const services = await ipfs.pin.remote.service.ls();
    return services.some(service => service.service === name);
}

export async function registerServiceIfNot(ipfs: IPFS, service: { name: string; endpoint: URL; key: string; }) {

    const { name: serviceName, endpoint, key } = service;
    const isRegisted = await isServiceRegistered(ipfs, serviceName);

    if (!isRegisted) {
        await ipfs.pin.remote.service.add(serviceName, {
            endpoint,
            key,
        });
    }
}

export async function pinDataRemotely(cid: CID<unknown, number, number, Version> | string) {

    const pinata = new PinataSDK(API_KEY, SECRET_KEY);

    if (typeof cid === 'string')
        pinata.pinByHash(cid);
    else
        pinata.pinByHash(cid.toString());

    // pinata.pinFileToIPFS(cid.toString(), {
    //     pinataMetadata: {
    //         name: 'test',
    //     },
    //     pinataOptions: {
    //         cidVersion: 1,
    //         wrapWithDirectory: true,
    //     }
    // });
}