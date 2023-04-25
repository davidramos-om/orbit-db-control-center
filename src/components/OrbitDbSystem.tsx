import { useState, useEffect } from 'react';
import { chakra, useToken, useDisclosure } from "@chakra-ui/react";
import { type IPFS } from "ipfs-core";
import type OrbitDB from "orbit-db";

import { useAppLogDispatch } from "#/context/logs-reducer";
import useIsMounted from "#/hooks/useIsMounted";
import { SystemState } from "#/lib/types";
import { initOrbitDB, initPrograms } from "#/lib/db";

import { OrbitDbSystemInfo } from "./OrbitDbSystemInfo";
import { SytemStatusIcon } from "./SytemStatusIcon";

type Props = {
    ipfs: IPFS | null;
    onOrbitDbReady: () => void;
}

export function OrbitDbSystem({ ipfs, onOrbitDbReady }: Props) {

    const dispatch = useAppLogDispatch();
    const isMounted = useIsMounted();
    const { isOpen, onClose, onOpen } = useDisclosure(); 
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);
    const [ orbitDb, setOrbitDb ] = useState<OrbitDB | null>(null);
    const color = useToken('colors', dbState === SystemState.connected ? 'green.500' : dbState === SystemState.error ? 'red.500' : dbState === SystemState.disconnected ? 'black.500' : 'orange.700');

    useEffect(() => {

        const init = async () => {
            try {

                if (!ipfs)
                    return;

                dispatch({
                    type: 'add',
                    log: {
                        text: `Connecting to OrbitDB`,
                        type: 'connecting'
                    }
                });

                const db = await initOrbitDB(ipfs);            
                if (!isMounted())
                    return;

                await initPrograms();
                if (!isMounted())
                    return;

                if (db?.id) {
                    setDbState(() => SystemState.connected);
                    setOrbitDb(() => db);
                    onOrbitDbReady();

                    dispatch({
                        type: 'add',
                        log: {
                            text: `Connected to OrbitDB Id : ${db.id}`,
                            type: 'connected'
                        }
                    });

                    dispatch({
                        type: 'add',
                        log: {
                            text: `OrbitDB Instance | identity:  ${(db as any).identity._id} | directory: ${(db as any).directory}`,
                            type: 'connected'
                        }
                    });
                }
                else
                    setDbState(() => SystemState.disconnected);
            }
            catch (error: any) {

                setDbState(() => SystemState.error);
                dispatch({
                    type: 'add',
                    log: {
                        text: `Error connecting to OrbitDB : ${error.message}`,
                        type: 'error'
                    }
                });
            }
        };

        setTimeout(() => { init(); }, 1500);

    }, [ ipfs, dispatch, isMounted, onOrbitDbReady ]);


    const handleOpen = () => {

        if (!orbitDb)
            return;

        if (dbState !== SystemState.connected)
            return;

        onOpen();
    }

    return (
        <chakra.div
            cursor={ipfs ? 'pointer' : 'default'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleOpen}
        >
            <SytemStatusIcon label="OrbitDB" color={color} />
            <OrbitDbSystemInfo
                orbitDb={orbitDb}
                open={isOpen}
                onClose={onClose}
            />
        </chakra.div>
    );
}
