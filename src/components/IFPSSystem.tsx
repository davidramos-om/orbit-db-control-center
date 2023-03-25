import { useState, useEffect } from 'react';
import { useToken } from "@chakra-ui/react";
import { type IPFS } from "ipfs-core";

import { useAppLogDispatch } from "src/context/logs-reducer";
import useIsMounted from "src/hooks/useIsMounted";
import { SystemState } from "src/lib/types";
import { initIPFS } from "src/lib/db";
import { v4Id } from "src/utils/helper";

import { SytemStatusIcon } from "./SytemStatusIcon";

type Props = {
    onIpfsReady: (ipfs: IPFS) => void;
}

export function IFPSSystem({ onIpfsReady }: Props) {

    const dispatch = useAppLogDispatch();
    const isMounted = useIsMounted();;
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);
    const color = useToken('colors', dbState === SystemState.connected ? 'green.500' : dbState === SystemState.error ? 'red.500' : dbState === SystemState.disconnected ? 'black.500' : 'orange.500');

    useEffect(() => {

        const init = async () => {
            try {

                dispatch({
                    type: 'added',
                    log: {
                        done: true,
                        id: v4Id(),
                        text: `Connecting to IPFS node`,
                        type: 'created'
                    }
                });

                const ipfs = await initIPFS();

                if (!isMounted())
                    return;

                if (Object.keys(ipfs).length > 0) {
                    setDbState(() => SystemState.connected);
                    onIpfsReady(ipfs);

                    dispatch({
                        type: 'added',
                        log: {
                            done: true,
                            id: v4Id(),
                            text: `Connected to IPFS`,
                            type: 'created'
                        }
                    });
                }
                else
                    setDbState(() => SystemState.disconnected);
            }
            catch (error: any) {

                setDbState(() => SystemState.error);
                dispatch({
                    type: 'added',
                    log: {
                        done: true,
                        id: v4Id(),
                        text: `Error connecting to IPFS : ${error.message}`,
                        type: 'created'
                    }
                });
            }
        };

        setTimeout(() => { init(); }, 1500);

    }, []);

    return (
        <SytemStatusIcon label="IPFS" color={color} />
    );
}


