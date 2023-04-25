import { useState, useRef } from "react";
import {
    Button, Text, useDisclosure, useToast,
    UnorderedList, ListItem,
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, ModalCloseButton, Code, Input, Stack, Divider,
} from '@chakra-ui/react';

import { DBType } from "#/lib/types";
import { grantAccess } from "#/lib/manage-dbs";
import { useAppLogDispatch } from "#/context/logs-reducer";

export type DbDetails = {
    address: string;
    name: string;
    type: DBType | 'none';
    permissions: Record<string, string>[];
    entriesCount: number;
}


type Props = {
    db?: DbDetails;
}

export function DbInformationGrantAccess({ db }: Props) {

    const cancelRef = useRef();
    const [ access, setAccess ] = useState<string[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ publicKey, setPublicKey ] = useState<string>('');
    const dispatch = useAppLogDispatch();
    const toast = useToast();

    const handleGrantAccess = async () => {

        try {

            if (!db?.address)
                return;

            await grantAccess(db.address, access);
            toast.closeAll();
            toast({
                title: "Access granted",
                description: "Access to the database has been granted",
                status: "success",
                isClosable: true,
            });

            onClose();
        }
        catch (error) {

            toast.closeAll();
            toast({
                title: "Error granting access",
                description: "Error granting access to the database",
                isClosable: true,
            });

            if (error instanceof Error) {
                dispatch({
                    type: 'add',
                    log: {
                        type: 'error',
                        text: 'Error granting access : ' + error?.message || 'Unknown error',
                    }
                });
            }
        }
    }


    const handleAddPublicKey = () => {

        if (!publicKey)
            return;

        setAccess((prev) => {

            if (prev.includes(publicKey))
                return prev;

            return [ ...prev, publicKey ];
        });
    }


    if (!db)
        return null;

    return (
        <>
            <Button
                colorScheme='pink'
                onClick={onOpen}
                variant={"ghost"}
            >
                Permissions
            </Button>
            <AlertDialog
                motionPreset="scale"
                isOpen={isOpen}
                leastDestructiveRef={cancelRef as any}
                onClose={onClose}
                size="2xl"

            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader >
                            Grant access to <Code colorScheme="pink">{db.name}</Code> database
                        </AlertDialogHeader>
                        <ModalCloseButton />
                        <AlertDialogBody>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                            >
                                <Input
                                    placeholder="Identity Id"
                                    value={publicKey}
                                    onChange={(e) => setPublicKey(e.target.value)}
                                />
                                <Button
                                    colorScheme='green'
                                    onClick={handleAddPublicKey}
                                    ml={3}
                                >
                                    Add
                                </Button>
                            </Stack>
                            <Divider my={3} />
                            <UnorderedList
                                spacing={3}
                                minH={"20"}
                            >
                                {access.map((pk) => (
                                    <ListItem key={pk}>
                                        <Text>{pk}</Text>
                                    </ListItem>
                                ))}
                            </UnorderedList>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={onClose}>
                                Discard
                            </Button>
                            <Button
                                colorScheme='pink'
                                onClick={handleGrantAccess}
                                ml={3}
                            >
                                Save access
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}