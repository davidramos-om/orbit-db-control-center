import { useRef } from "react"
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
    FormControl, FormLabel, Input, ModalCloseButton, Select, Stack, useControllableState, useDisclosure
} from "@chakra-ui/react"

import { showAlert } from "src/utils/SweetAlert2";
import { DBType, DBPermission } from 'src/types/orbitdb';
import { createDatabase } from 'src/database';


//create list from enum DBType
const dbTypeList = Object.values(DBType).filter((v) => isNaN(Number(v)));
// const dbPermissionList = Object.values(DBPermission).filter((v) => isNaN(Number(v)));

// const dbTypeList: string[] = [ 'log', 'keyvalue', 'feed', 'docs', 'counter' ];
const dbPermissionList: string[] = [ 'private', 'public' ];


function CreateDbDialog() {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [ db, setDb ] = useControllableState({ defaultValue: '' });
    const [ dbType, setDbType ] = useControllableState<DBType | ''>({ defaultValue: '' });
    const [ permission, setPermission ] = useControllableState<DBPermission | ''>({ defaultValue: '' });


    const handleCreate = async () => {
        try {

            if (!db || !dbType || !permission)
                throw new Error('Please fill all fields');


            const newDb = await createDatabase(db, dbType, permission);
            // console.log(`🐛  -> 🔥 :  handleCreate 🔥 :  newDb:`, newDb);
            onClose();
        }
        catch (error: any) {
            console.log(error);
            showAlert({
                title: 'Error',
                text: error?.message || 'Something went wrong',
                icon: 'error'
            });
        }
    }

    return (
        <>
            <Button
                variant={"outline"}
                colorScheme='teal'
                onClick={onOpen}
            >
                New Database
            </Button>

            <AlertDialog
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
                                    <Select placeholder="Select option">
                                        {dbTypeList.map((dbType) => (
                                            <option key={dbType} value={dbType}>{dbType}</option>
                                        ))}
                                        {/* <option value="log">Inmutable Log</option>
                                        <option value="keyvalue">Key-Value Store</option>
                                        <option value="feed"> List of Entries</option>
                                        <option value="docs">Document Store</option>
                                        <option value="counter">Counter (CRDT)</option> */}
                                    </Select>
                                </FormControl>
                                <FormControl id="permission">
                                    <FormLabel>Write Permissions</FormLabel>
                                    <Select placeholder="Select option">
                                        {dbPermissionList.map((permission) => (
                                            <option key={permission} value={permission}>{permission}</option>
                                        ))}
                                        {/* <option value="private">Creator-only : only you can write, anyone can read</option>
                                        <option value="public">Public : Anyone can read and write</option> */}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme='teal'
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