import { useState } from 'react';
import { type IPFS } from "ipfs-core";

import { IFPSSystem } from "./IFPSSystem";
import { OrbitDbSystem } from "./OrbitDbSystem";

export function Systems() {

    const [ ipfs, setIpfs ] = useState<IPFS | null>(null);

    return (
        <>
            <IFPSSystem onIpfsReady={setIpfs} />
            <OrbitDbSystem ipfs={ipfs} />
        </>
    );
}
