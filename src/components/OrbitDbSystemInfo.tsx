import { useEffect, useRef, useState } from 'react';
import { List, ListItem, Button, AlertDialog, AlertDialogOverlay, AlertDialogCloseButton, AlertDialogHeader, AlertDialogContent, AlertDialogBody } from "@chakra-ui/react";
import type OrbitDB from "orbit-db";

type Props = {
    open: boolean;
    orbitDb: OrbitDB | null;
    onClose: () => void;
};

export function OrbitDbSystemInfo({ open, orbitDb, onClose }: Props) {

    const cancelRef = useRef();
    const [ info, setInfo ] = useState<{
        id: string;
        key: string;
        identityId: string;
        directory: string;
        publicKey: string;
    }>({
        id: '',
        key: '',
        identityId: '',
        publicKey: '',
        directory: '',
    });

    useEffect(() => {

        if (!orbitDb)
            return;

        const getInfo = async () => {

            const dbAny = orbitDb as any;
            setInfo({
                id: dbAny.id || '',
                key: dbAny.key || '',
                identityId: dbAny.identity.id || '',
                publicKey: dbAny.identity.publicKey || '',
                directory: dbAny.directory || '',
            });

        }

        getInfo();

    }, [ orbitDb ]);

    if (!orbitDb)
        return null;

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
                    OrbitDB Info
                </AlertDialogHeader>
                <AlertDialogBody>
                    <List spacing={3}>

                        <ListItem>
                            <b>Id:</b> {info.id}
                        </ListItem>
                        <ListItem>
                            <b>Key:</b> {info.key}
                        </ListItem>
                        <ListItem>
                            <b>Identity/Peer Id:</b> {info.identityId}
                        </ListItem>
                        <ListItem>
                            <b>Public Key:</b> {info.publicKey}
                        </ListItem>
                        <ListItem>
                            <b>Directory:</b> {info.directory}
                        </ListItem>
                        <ListItem>
                            <Button
                                width="100%"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => {
                                    console.info('OrbitDbSystemInfo.orbit-db', orbitDb);
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
