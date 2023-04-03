import { useState } from 'react';
import { type IPFS } from "ipfs-core";

import { useAppDbDispatch } from "#/context/dbs-reducer";
import { getAllPrograms } from "#/lib/manage-programs";
import { MapOrbitDbEntry } from "#/lib/mapper";
import { IFPSSystem } from "./IFPSSystem";
import { OrbitDbSystem } from "./OrbitDbSystem";

export function Systems() {

    const dispatch = useAppDbDispatch();
    const [ ipfs, setIpfs ] = useState<IPFS | null>(null);

    const handleOrbitDbReady = async () => {

        const programs = await getAllPrograms();
        const dbs = programs.map((db: any) => { return MapOrbitDbEntry(db) });
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
