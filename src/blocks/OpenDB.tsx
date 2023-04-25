import { useRef, useState } from "react"
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
    FormControl, FormLabel, Input, ModalCloseButton, Stack, useControllableState, useDisclosure, useToast,
} from "@chakra-ui/react"

import { connectToDb } from "#/lib/manage-dbs";
import { useAppLogDispatch } from '#/context/logs-reducer';
import { useSiteState } from '#/context/site-reducer';
import { isValidDbAddress } from "#/lib/helper";

type OpenDbProps = {
    onDbOpened: (hash: string) => void;
}

function OpenDbDialog({ onDbOpened }: OpenDbProps) {

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ dbAddress, setDbAddress ] = useControllableState({ defaultValue: '' });
    const cancelRef = useRef();
    const { orbitDbReady } = useSiteState();
    const dispatch = useAppLogDispatch();
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleOpenDb = async () => {
        try {

            if (!dbAddress) {
                toast.closeAll();
                toast({
                    position: 'top',
                    description: 'Please enter database address',
                    status: 'error',
                    isClosable: true,
                });
                return;
            }

            if (!isValidDbAddress(dbAddress)) {
                toast.closeAll();
                toast({
                    position: 'top',
                    description: 'Invalid database address',
                    status: 'error',
                    isClosable: true,
                });
                return;
            }

            setLoading(true);
            const { hash } = await connectToDb(dbAddress);
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

            toast.closeAll();
            toast({
                position: 'top',
                description: 'Unable to connect to database,please check output for more details',
                status: 'error',
                isClosable: true,
            });

            dispatch({
                type: 'add',
                log: {
                    text: `Failed to connect to database ${dbAddress} : ${error?.message || 'Something went wrong'}`,
                    type: 'error',
                }
            });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Button
                variant={"ghost"}
                colorScheme='pink'
                onClick={onOpen}
                isDisabled={!orbitDbReady}
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

                                <FormControl id="info">
                                    <FormLabel>
                                        Please consider that replicating the database across peers may take a while.
                                    </FormLabel>
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
                                isLoading={loading}
                                loadingText='Connecting'
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