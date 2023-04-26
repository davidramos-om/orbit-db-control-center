import { useState, useEffect } from 'react';
import { chakra, useToken, useDisclosure } from "@chakra-ui/react";

import { useAppLogDispatch } from "#/context/LogsContext";
import { useSiteStateDispatch, useSiteState } from "#/context/SiteContext";
import { useAppDbDispatch } from "#/context/DBsContext";
import useIsMounted from "#/hooks/useIsMounted";

import { initOrbitDB, initPrograms } from "#/lib/db";
import { SystemState } from "#/lib/types";
import { MapOrbitDbEntry } from "#/lib/mapper";
import { getAllPrograms } from "#/lib/manage-programs";

import { OrbitDbSystemInfo } from "./OrbitDbSystemInfo";
import { SytemStatusIcon } from "./SytemStatusIcon";

export function OrbitDbSystem() {

    const logDispatcher = useAppLogDispatch();
    const DbDispatcher = useAppDbDispatch();
    const siteStateDispatcher = useSiteStateDispatch();
    const { ipfs, ipfsReady, orbitDb, orbitDbReady } = useSiteState();

    const isMounted = useIsMounted();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);

    const color = useToken('colors', dbState === SystemState.connected ? 'green.500' : dbState === SystemState.error ? 'red.500' : dbState === SystemState.disconnected ? 'black.500' : 'orange.700');

    useEffect(() => {

        if (!ipfs || !ipfsReady || !orbitDb || !orbitDbReady)
            setDbState(() => SystemState.disconnected);

    }, [ ipfs, ipfsReady, orbitDb, orbitDbReady ]);

    useEffect(() => {

        const init = async () => {
            try {

                if (!ipfs || !ipfsReady)
                    return;

                logDispatcher({
                    type: 'add',
                    log: {
                        text: `Connecting to OrbitDB`,
                        type: 'connecting'
                    }
                });

                const db = await initOrbitDB(ipfs);
                if (!db)
                    throw Error('Could not connect to OrbitDB');

                siteStateDispatcher({ type: 'setOrbitDb', value: db });
                logDispatcher({ type: 'add', log: { text: `Connected to OrbitDB Id : ${db.id}`, type: 'connected' } });


                await initPrograms();
                const programs = await getAllPrograms();
                const dbs = programs?.map((db: any) => { return MapOrbitDbEntry(db) }) || [];
                DbDispatcher({ type: 'init', dbs });

                if (isMounted())
                    setDbState(() => SystemState.connected);

                logDispatcher({
                    type: 'add',
                    log: {
                        text: `OrbitDB Instance | identity:  ${(db as any).identity._id} | directory: ${(db as any).directory}`,
                        type: 'connected'
                    }
                });
            }
            catch (error: any) {
                setDbState(() => SystemState.error);
                logDispatcher({
                    type: 'add',
                    log: {
                        text: `Error connecting to OrbitDB : ${error.message}`,
                        type: 'error'
                    }
                });
            }
        };

        setTimeout(() => { init(); }, 1500);

    }, [ ipfs, ipfsReady, logDispatcher, siteStateDispatcher, DbDispatcher, isMounted, ]);


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
