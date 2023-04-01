import { useRef } from "react"
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
    FormControl, FormLabel, Input, ModalCloseButton, Stack, useControllableState, useDisclosure, useToast,
} from "@chakra-ui/react"

import { addDatabase } from 'src/lib/db';
import { useAppLogDispatch } from 'src/context/logs-reducer';

type OpenDbProps = {
    onDbOpened: (hash: string) => void;
}

function OpenDbDialog({ onDbOpened }: OpenDbProps) {

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ dbAddress, setDbAddress ] = useControllableState({ defaultValue: '' });
    const cancelRef = useRef();
    const dispatch = useAppLogDispatch();

    const handleOpenDb = async () => {
        try {

            if (!dbAddress) {
                toast({
                    position: 'top',
                    description: 'Please enter database address',
                    status: 'error',
                    isClosable: true,
                });
                return;
            }

            const { hash } = await addDatabase(dbAddress);

            dispatch({
                type: 'add',
                log: {
                    text: `Connected to database ${dbAddress}`,
                    type: 'connected',
                }
            });

            onClose();
            onDbOpened(hash);
        }
        catch (error: any) {

            dispatch({
                type: 'add',
                log: {
                    text: `Failed to connect to database ${dbAddress} : ${error?.message || 'Something went wrong'}`,
                    type: 'error',
                }
            });
        }
    }

    return (
        <>
            <Button
                variant={"ghost"}
                colorScheme='pink'
                onClick={onOpen}
            >
                Open Database
            </Button>
            <AlertDialog
                motionPreset='slideInBottom'
                isOpen={isOpen}
                leastDestructiveRef={cancelRef as any}
                onClose={onClose}
                size='xl'                
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Connect to Database
                        </AlertDialogHeader>
                        <ModalCloseButton />
                        <AlertDialogBody>
                            <Stack spacing={4}>
                                <FormControl id="dbname">
                                    <FormLabel>Database Address</FormLabel>
                                    <Input
                                        type="text"
                                        placeholder="Enter database address"
                                        value={dbAddress}
                                        onChange={(e) => setDbAddress(e.target.value)}
                                    />
                                </FormControl>
                            </Stack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme='pink'
                                onClick={handleOpenDb}
                                ml={3}
                            >
                                Connect
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default OpenDbDialog