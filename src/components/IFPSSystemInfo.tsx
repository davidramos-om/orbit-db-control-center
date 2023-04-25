import { useEffect, useRef, useState } from 'react';
import { List, ListItem, AlertDialog, AlertDialogOverlay, AlertDialogCloseButton, AlertDialogHeader, AlertDialogContent, AlertDialogBody, Button } from "@chakra-ui/react";
import { type IPFS, } from "ipfs-core";

type Props = {
    open: boolean;
    ipfs: IPFS | null;
    onClose: () => void;
};

export function IFPSSystemInfo({ open, ipfs, onClose }: Props) {

    const cancelRef = useRef();
    const [ info, setInfo ] = useState<{
        id: string;
        version: string;
        agentVersion: string;
        protocolVersion: string;
        repo: string,
        online: boolean,
    }>({
        id: '',
        version: '',
        agentVersion: '',
        protocolVersion: '',
        repo: '',
        online: false,
    });

    useEffect(() => {

        if (!ipfs)
            return;

        const getInfo = async () => {

            const repo = await ipfs.repo.stat();
            const id = await ipfs.id();
            const version = await ipfs.version();
            const agentVersion = id.agentVersion;
            const protocolVersion = id.protocolVersion;
            const online = ipfs.isOnline();

            setInfo({
                id: id.publicKey,
                online: online,
                version: version.version,
                agentVersion: agentVersion,
                protocolVersion: protocolVersion,
                repo: repo.repoPath,
            });

        }

        getInfo();

    }, [ ipfs ]);



    return (
        <AlertDialog
            isOpen={open}
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef as any}
            onClose={onClose}
        >
            <AlertDialogOverlay />
            <AlertDialogContent
            >
                <AlertDialogCloseButton />
                <AlertDialogHeader>
                    IPFS Info
                </AlertDialogHeader>
                <AlertDialogBody>
                    <List spacing={3}>
                        <ListItem>
                            <b>Online:</b> {info.online ? 'Yes' : 'No'}
                        </ListItem>
                        <ListItem>
                            <b>Public key:</b> {info.id}
                        </ListItem>
                        <ListItem>
                            <b>Version:</b> {info.version}
                        </ListItem>
                        <ListItem>
                            <b>agent Version:</b> {info.agentVersion}
                        </ListItem>
                        <ListItem>
                            <b>Protocol Version:</b> {info.protocolVersion}
                        </ListItem>
                        <ListItem>
                            <Button
                                width="100%"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => {
                                    console.info('IFPSSystemInfo.ipfs', ipfs);
                                }}
                            >
                                Print to console
                            </Button>
                        </ListItem>
                    </List>
                </AlertDialogBody>
            </AlertDialogContent>

        </AlertDialog>
    );
}
