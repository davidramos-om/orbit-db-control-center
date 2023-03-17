import { useRef } from "react"
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
    FormControl, FormLabel, Input, ModalCloseButton, Select, Stack, useDisclosure
} from "@chakra-ui/react"

function CreateDbDialog() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()

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
                                    <Input type="text" />
                                </FormControl>
                                <FormControl id="dbtype">
                                    <FormLabel>Database type</FormLabel>
                                    <Select placeholder="Select option">
                                        <option value="log">Inmutable Log</option>
                                        <option value="keyvalue">Key-Value Store</option>
                                        <option value="feed"> List of Entries</option>
                                        <option value="docs">Document Store</option>
                                        <option value="counter">Counter (CRDT)</option>
                                    </Select>
                                </FormControl>
                                <FormControl id="permission">
                                    <FormLabel>Write Permissions</FormLabel>
                                    <Select placeholder="Select option">
                                        <option value="private">Creator-only : only you can write, anyone can read</option>
                                        <option value="public">Public : Anyone can read and write</option>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='teal' onClick={onClose} ml={3}>
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