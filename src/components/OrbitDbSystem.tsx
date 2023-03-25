import { useState, useEffect } from 'react';
import { useToken } from "@chakra-ui/react";
import { type IPFS } from "ipfs-core";

import { useAppLogDispatch } from "src/context/logs-reducer";
import useIsMounted from "src/hooks/useIsMounted";
import { v4Id } from "src/utils/helper";
import { SystemState } from "src/lib/types";
import { initOrbitDB } from "src/lib/db";

import { SytemStatusIcon } from "./SytemStatusIcon";

type Props = {
    ipfs: IPFS | null;
    onOrbitDbReady: () => void;
}

export function OrbitDbSystem({ ipfs, onOrbitDbReady }: Props) {

    const dispatch = useAppLogDispatch();
    const isMounted = useIsMounted();
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);
    const color = useToken('colors', dbState === SystemState.connected ? 'green.500' : dbState === SystemState.error ? 'red.500' : dbState === SystemState.disconnected ? 'black.500' : 'orange.700');

    useEffect(() => {

        const init = async () => {
            try {

                if (!ipfs)
                    return;

                dispatch({
                    type: 'added',
                    log: {
                        done: true,
                        id: v4Id(),
                        text: `Connecting to OrbitDB`,
                        type: 'created'
                    }
                });

                const db = await initOrbitDB(ipfs);

                if (!isMounted())
                    return;

                if (db?.id) {
                    setDbState(() => SystemState.connected);
                    onOrbitDbReady();

                    dispatch({
                        type: 'added',
                        log: {
                            done: true,
                            id: v4Id(),
                            text: `Connected to OrbitDB Id : ${db.id}`,
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
                        text: `Error connecting to OrbitDB : ${error.message}`,
                        type: 'created'
                    }
                });
            }
        };

        setTimeout(() => { init(); }, 1500);

    }, [ ipfs ]);

    return (
        <SytemStatusIcon label="OrbitDB" color={color} />
    );
}
