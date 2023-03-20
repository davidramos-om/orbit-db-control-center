import { useState, useEffect } from 'react';
import { useToken } from "@chakra-ui/react";
import { type IPFS } from "ipfs-core";

import useIsMounted from "src/hooks/useIsMounted";
import { SystemState } from "src/lib/types";
import { initIPFS } from "src/lib/db";
import { SytemStatusIcon } from "./SytemStatusIcon";

type Props = {
    onIpfsReady: (ipfs: IPFS) => void;
}

export function IFPSSystem({ onIpfsReady }: Props) {

    const isMounted = useIsMounted();;
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);
    const color = useToken('colors', dbState === SystemState.connected ? 'green.500' : dbState === SystemState.error ? 'red.500' : dbState === SystemState.disconnected ? 'black.500' : 'orange.500');

    useEffect(() => {

        const init = async () => {
            try {

                const ipfs = await initIPFS();

                if (!isMounted())
                    return;

                if (Object.keys(ipfs).length > 0) {
                    setDbState(() => SystemState.connected);
                    onIpfsReady(ipfs);
                }
                else
                    setDbState(() => SystemState.disconnected);
            }
            catch (error: any) {
                console.error("init.errors : ", { error });
                setDbState(() => SystemState.error);
            }
        };

        setTimeout(() => { init(); }, 1500);

    }, []);

    return (
        <SytemStatusIcon label="IPFS" color={color} />
    );
}
