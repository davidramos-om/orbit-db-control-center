import { useRef } from "react";
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
    FormControl, FormLabel, Input, ModalCloseButton, Select, Stack, useControllableState, useDisclosure, useToast
} from "@chakra-ui/react"

import { DBType, DBPermission, DbTypeExtendedDescription, DBPermissionExtendedDescription } from 'src/lib/types';
import { createDatabase } from 'src/lib/db';
import { MapOrbitDbEntry } from "src/lib/mapper";
import { useAppDbDispatch } from "src/context/dbs-reducer";

import { useAppLogDispatch } from "../context/logs-reducer";

function CreateDbDialog() {

    const toast = useToast();
    const dispatch = useAppDbDispatch();
    const logDispatch = useAppLogDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [ db, setDb ] = useControllableState({ defaultValue: '' });
    const [ dbType, setDbType ] = useControllableState<DBType | ''>({ defaultValue: '' });
    const [ permission, setPermission ] = useControllableState<DBPermission | ''>({ defaultValue: '' });

    const handleCreate = async () => {
        try {

            if (!db || !dbType || !permission) {
                toast({
                    position: 'top',
                    description: 'Please enter all the fields',
                    status: 'error',
                    isClosable: true,
                });
                return;
            }

            const { db: newDb } = await createDatabase({
                name: db,
                type: dbType,
                permissions: permission
            });

            const dbEntry = MapOrbitDbEntry(newDb);
            dispatch({
                type: "added",
                db: dbEntry
            });

            logDispatch({
                type: 'add',
                log: {
                    id: dbEntry.payload.value.address,
                    text: `Created new database ${dbEntry.payload.value.name}`,
                    type: 'created'
                }
            });

            onClose();
        }
        catch (error: any) {

            logDispatch({
                type: 'add',
                log: {
                    text: `Failed to create database ${db} : ${error?.message || 'Something went wrong'}`,
                    type: 'error'
                }
            });
        }
    }

    return (
        <>
            <Button
                variant={"solid"}
                colorScheme='pink'
                onClick={onOpen}
            >
                New Database
            </Button>
            <AlertDialog
                motionPreset="slideInBottom"
                isOpen={isOpen}
                leastDestructiveRef={cancelRef as any}
                onClose={onClose}
                size='xl'
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Create Database
                        </AlertDialogHeader>
                        <ModalCloseButton />
                        <AlertDialogBody>
                            <Stack spacing={4}>
                                <FormControl id="dbname">
                                    <FormLabel>Database Name</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Enter database name"
                                        value={db}
                                        onChange={(e) => setDb(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl id="dbtype">
                                    <FormLabel>Database type</FormLabel>
                                    <Select
                                        placeholder="Select option"
                                        value={dbType}
                                        onChange={(e) => setDbType(e.target.value as DBType)}
                                    >
                                        {DbTypeExtendedDescription.map((item) => (
                                            <option key={item.type} value={item.type}>{`${item.type} : ${item.description}`}</option>
                                        ))}                                        
                                    </Select>
                                </FormControl>
                                <FormControl id="permission">
                                    <FormLabel>Write Permissions</FormLabel>
                                    <Select
                                        placeholder="Select option"
                                        value={permission}
                                        onChange={(e) => setPermission(e.target.value as DBPermission)}
                                    >
                                        {DBPermissionExtendedDescription.map((item) => (
                                            <option key={item.type} value={item.type}>{`${item.type} : ${item.description}`}</option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme='pink'
                                onClick={handleCreate}
                                ml={3}
                            >
                                Create
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default CreateDbDialog