import { useRef } from "react";
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
    FormControl, FormLabel, Input, ModalCloseButton, Select, Stack, Divider, List, ListItem, Text, IconButton,
    useControllableState, useDisclosure, useToast, HStack
} from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons";

import { DBType, DBPermission, DbTypeExtendedDescription, DBPermissionExtendedDescription } from '#/lib/types';
import { getProgramByHash } from "#/lib/manage-programs";
import { getOrbitDB } from "#/lib/db";
import { createDatabase } from "#/lib/manage-dbs";
import { MapOrbitDbEntry } from "#/lib/mapper";
import { useAppDbDispatch } from "#/context/dbs-reducer";
import { useAppLogDispatch } from "#/context/logs-reducer";

function CreateDbDialog() {

    const toast = useToast();
    const dispatch = useAppDbDispatch();
    const logDispatch = useAppLogDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [ db, setDb ] = useControllableState({ defaultValue: '' });
    const [ dbType, setDbType ] = useControllableState<DBType | ''>({ defaultValue: '' });
    const [ permission, setPermission ] = useControllableState<DBPermission | ''>({ defaultValue: '' });

    const [ identity, setIdentity ] = useControllableState<string>({ defaultValue: '' });
    const [ identities, setIdentities ] = useControllableState<string[]>({ defaultValue: [] });
    const orbitdb = getOrbitDB();
    const dbIdentity = orbitdb?.identity.id as string;


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

            if (!dbIdentity)
                throw new Error('No identity found');

            const { hash } = await createDatabase({
                name: db,
                type: dbType,
                permissions: permission,
                access: [ dbIdentity, ...identities ]
            });

            const program = getProgramByHash(hash);
            const dbEntry = MapOrbitDbEntry(program);

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

    const handleAddIdentity = () => {

        if (!identity)
            return;

        if (identity === dbIdentity)
            return;

        setIdentities((prev) => {

            if (prev.includes(identity))
                return prev;

            return [ ...prev, identity ];
        });
    }

    const handleRemoveIdentity = (id: string) => () => {

        if (id === dbIdentity)
            return;

        setIdentities((prev) => prev.filter((i) => i !== id));
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
                size='2xl'
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
                                {dbIdentity && permission === 'custom' && (
                                    <FormControl id="custom-permission">
                                        <Stack
                                            direction={{ base: 'column', sm: 'row' }}
                                        >
                                            <Input
                                                placeholder="Identity Id"
                                                value={identity}
                                                onChange={(e) => setIdentity(e.target.value)}
                                            />
                                            <Button
                                                variant={"ghost"}
                                                colorScheme='green'
                                                onClick={handleAddIdentity}
                                                ml={3}
                                            >
                                                Add
                                            </Button>
                                        </Stack>
                                        <Divider my={3} />
                                        <List
                                            spacing={3}
                                            minH={"20"}
                                        >
                                            {[ dbIdentity, ...identities ].map((pk) => (
                                                <ListItem
                                                    key={pk}
                                                >
                                                    <HStack>
                                                        <IconButton
                                                            variant="ghost"
                                                            icon={<DeleteIcon />}
                                                            aria-label="Delete"
                                                            isDisabled={pk === dbIdentity}
                                                            onClick={handleRemoveIdentity(pk)}
                                                        />
                                                        <Text>{pk}</Text>
                                                    </HStack>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </FormControl>
                                )}
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