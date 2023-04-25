import { useState, useEffect } from 'react';
import { useToken, chakra, useDisclosure } from "@chakra-ui/react";
import { type IPFS, } from "ipfs-core";

import { useAppLogDispatch } from "#/context/logs-reducer";
import useIsMounted from "#/hooks/useIsMounted";
import { SystemState } from "#/lib/types";
import { initIPFS } from "#/lib/db";

import { IFPSSystemInfo } from "./IFPSSystemInfo";
import { SytemStatusIcon } from "./SytemStatusIcon";

type Props = {
    onIpfsReady: (ipfs: IPFS) => void;
}

export function IFPSSystem({ onIpfsReady }: Props) {

    const dispatch = useAppLogDispatch();
    const isMounted = useIsMounted();

    const { isOpen, onClose, onOpen } = useDisclosure(); 
    const [ dbState, setDbState ] = useState<SystemState>(SystemState.connecting);
    const [ ipfs, setIpfs ] = useState<IPFS | null>(null);

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
                if (!isMounted())
                    return;

                if (ipfs) {

                    setDbState(() => SystemState.connected);
                    setIpfs(() => ipfs);
                    if (!isMounted())
                        return;

                    onIpfsReady(ipfs);                    
                    dispatch({
                        type: 'add',
                        log: {
                            text: `Connected to IPFS`,
                            type: 'connected'
                        }
                    });

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
                else
                    setDbState(() => SystemState.disconnected);
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

    }, [ dispatch, isMounted, onIpfsReady ]);


    useEffect(() => {

        if (!ipfs)
            return;

        const check = async () => {

            try {
                await ipfs.id();
                setDbState(() => SystemState.connected);
            }
            catch (error: any) {
                setDbState(() => SystemState.disconnected);
            }
        };

        const interval = setInterval(() => { check(); }, 5000);

        return () => { clearInterval(interval); };

    }, [ ipfs ]);


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


