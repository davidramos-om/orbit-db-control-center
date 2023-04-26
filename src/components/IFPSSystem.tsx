import { useState, useEffect } from 'react';
import { useToken, chakra, useDisclosure } from "@chakra-ui/react";

import { useAppLogDispatch } from "#/context/LogsContext";
import { useSiteStateDispatch, useSiteState } from "#/context/SiteContext";
import useIsMounted from "#/hooks/useIsMounted";
import { SystemState } from "#/lib/types";
import { initIPFS } from "#/lib/db";

import { IFPSSystemInfo } from "./IFPSSystemInfo";
import { SytemStatusIcon } from "./SytemStatusIcon";

export function IFPSSystem() {

    const dispatch = useAppLogDispatch();
    const siteStateDispatch = useSiteStateDispatch();
    const { ipfs } = useSiteState()
    const isMounted = useIsMounted();

    const { isOpen, onClose, onOpen } = useDisclosure();
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);

    const color = useToken('colors', dbState === SystemState.connected ? 'green.500' : dbState === SystemState.error ? 'red.500' : dbState === SystemState.disconnected ? 'black.500' : 'orange.500');

    useEffect(() => {

        const init = async () => {
            try {

                dispatch({
                    type: 'add',
                    log: {
                        text: `Connecting to IPFS node`,
                        type: 'connecting'
                    }
                });

                const ipfs = await initIPFS();
                if (!ipfs)
                    return;

                siteStateDispatch({ type: 'setIpfs', value: ipfs });
                dispatch({
                    type: 'add',
                    log: {
                        text: `Connected to IPFS`,
                        type: 'connected'
                    }
                });

                if (!isMounted())
                    setDbState(() => SystemState.connected);

                const repo = await ipfs.repo.stat();
                const id = await ipfs.id();

                dispatch({
                    type: 'add',
                    log: {
                        text: `IPFS node | pubkey:${id.publicKey} | agent:${id.agentVersion} | protocol: ${id.protocolVersion} | repo:${repo.repoPath}`,
                        type: 'connected'
                    }
                });
            }
            catch (error: any) {
                setDbState(() => SystemState.error);
                dispatch({
                    type: 'add',
                    log: {
                        text: `Error connecting to IPFS : ${error.message}`,
                        type: 'error'
                    }
                });
            }
        };

        setTimeout(() => { init(); }, 1500);

    }, [ dispatch, siteStateDispatch, isMounted, ]);


    useEffect(() => {

        if (!ipfs)
            return;

        let latest_state: SystemState | null = null;
        const check = async () => {

            try {

                if (!ipfs) {
                    setDbState(() => SystemState.disconnected);
                    siteStateDispatch({
                        type: 'setIpfsReady',
                        value: false
                    });
                    return
                }

                await ipfs.id();

                if (latest_state === SystemState.connected)
                    return;

                setDbState(() => SystemState.connected);
                latest_state = SystemState.connected;

                siteStateDispatch({
                    type: 'setIpfsReady',
                    value: true
                });
            }
            catch (error: any) {
                setDbState(() => SystemState.disconnected);
                siteStateDispatch({
                    type: 'setIpfsReady',
                    value: false
                });
            }
        };

        const interval = setInterval(() => { check(); }, 5000);

        return () => { clearInterval(interval); };

    }, [ ipfs, siteStateDispatch ]);


    const handleOpen = () => {

        if (!ipfs)
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
            <SytemStatusIcon label="IPFS" color={color} />
            <IFPSSystemInfo
                ipfs={ipfs}
                open={isOpen}
                onClose={onClose}
            />
        </chakra.div>
    );
}


