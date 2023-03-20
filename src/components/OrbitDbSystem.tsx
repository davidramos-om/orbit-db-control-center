import { useState, useEffect } from 'react';
import { useToken } from "@chakra-ui/react";
import { type IPFS } from "ipfs-core";

import useIsMounted from "src/hooks/useIsMounted";
import { SystemState } from "src/lib/types";
import { initOrbitDB } from "src/lib/db";

import { SytemStatusIcon } from "./SytemStatusIcon";

type Props = {
    ipfs: IPFS | null;
}

export function OrbitDbSystem({ ipfs }: Props) {

    const isMounted = useIsMounted();
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);
    const color = useToken('colors', dbState === SystemState.connected ? 'green.500' : dbState === SystemState.error ? 'red.500' : dbState === SystemState.disconnected ? 'black.500' : 'orange.700');

    useEffect(() => {

        const init = async () => {
            try {

                if (!ipfs)
                    return;

                const db = await initOrbitDB(ipfs);

                if (!isMounted())
                    return;

                if (db?.id)
                    setDbState(() => SystemState.connected);
                else
                    setDbState(() => SystemState.disconnected);
            }
            catch (error: any) {
                console.error("init.errors : ", { error });
                setDbState(() => SystemState.error);
            }
        };

        setTimeout(() => { init(); }, 1500);

    }, [ ipfs ]);

    return (
        <SytemStatusIcon label="OrbitDB" color={color} />
    );
}
