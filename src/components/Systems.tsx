import { useState } from 'react';
import { type IPFS } from "ipfs-core";

import { useAppDbDispatch } from "src/context/dbs-reducer";
import { IFPSSystem } from "./IFPSSystem";
import { OrbitDbSystem } from "./OrbitDbSystem";
import { getAllDatabases } from "src/lib/db";
import { MapOrbitDbEntry } from "src/lib/mapper";

export function Systems() {

    const dispatch = useAppDbDispatch();
    const [ ipfs, setIpfs ] = useState<IPFS | null>(null);

    const handleOrbitDbReady = async () => {

        const entries = await getAllDatabases();
        const dbs = entries.map((db: any) => { return MapOrbitDbEntry(db) });
        dispatch({
            type: 'init',
            dbs,
        });
    }

    return (
        <>
            <IFPSSystem onIpfsReady={setIpfs} />
            <OrbitDbSystem ipfs={ipfs} onOrbitDbReady={handleOrbitDbReady} />
        </>
    );
}
