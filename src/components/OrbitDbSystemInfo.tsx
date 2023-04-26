import { useEffect, useRef, useState } from 'react';
import { List, ListItem, Button, AlertDialog, AlertDialogOverlay, AlertDialogCloseButton, AlertDialogHeader, AlertDialogContent, AlertDialogBody, useToast } from "@chakra-ui/react";
import type OrbitDB from "orbit-db";

import { useAppLogDispatch } from "#/context/LogsContext";
import { useSiteStateDispatch } from "#/context/SiteContext";
import { confirmAlert } from "#/utils/SweetAlert2";
import { setOrbitDB, setProgream } from "#/lib/db";
import { clearOpenedDBs } from "#/lib/manage-dbs";

type Props = {
    open: boolean;
    orbitDb: OrbitDB | null;
    onClose: () => void;
};

export function OrbitDbSystemInfo({ open, orbitDb, onClose }: Props) {

    const cancelRef = useRef();
    const [ stopping, setStopping ] = useState<boolean>(false);
    const toast = useToast();
    const logDispatcher = useAppLogDispatch();
    const siteStateDispatcher = useSiteStateDispatch();


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

    const handleStopOrbitDb = async () => {


        try {
            if (!orbitDb)
                return;

            const prompt = await confirmAlert({
                title: 'Stop OrbitDB',
                text: 'Are you sure you want to stop this OrbitDB instance?',
                cancelLabel: 'Cancel',
                confirmLabel: 'Stop',
            });

            if (!prompt.isConfirmed)
                return;

            logDispatcher({
                type: 'add',
                log: {
                    text: 'Stopping OrbitDb Service',
                    type: 'updated'
                }
            });

            await orbitDb.disconnect();
            setOrbitDB(null)
            setProgream(null);
            clearOpenedDBs();

            siteStateDispatcher({
                type: 'setOrbitDb',
                value: null
            });
        }
        catch (error) {

            toast.closeAll();
            toast({
                position: 'top',
                description: 'Could not stop, check the output for more details',
                status: 'error',
                isClosable: true,
            });

            if (error instanceof Error) {
                logDispatcher({
                    type: 'add',
                    log: {
                        text: `Could not stop service : ${error.message}`,
                        type: 'updated'
                    }
                });
            }
        }
        finally {
            setStopping(false);
        }
    }

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
                                    console.info({ OrbitDbInstance: orbitDb });
                                }}
                            >
                                Print to console
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                width="100%"
                                variant="ghost"
                                colorScheme="red"
                                onClick={handleStopOrbitDb}
                                disabled={!orbitDb}
                                isLoading={stopping}
                                loadingText="Stopping..."
                            >
                                Stop OrbitDB Service
                            </Button>
                        </ListItem>
                    </List>
                </AlertDialogBody>
            </AlertDialogContent>

        </AlertDialog>
    );
}
