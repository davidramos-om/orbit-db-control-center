import { useState } from "react";
import { Button, useToast, Stack, Checkbox, InputGroup, InputRightElement, Spacer, Textarea } from "@chakra-ui/react";

import EditJsonDocument from "#/blocks/EditJsonDocument";
import { useAppLogDispatch } from "#/context/LogsContext";
import { useSiteState } from "#/context/SiteContext";
import { isValidJson } from "#/utils/helper";
import { addEntry } from "#/lib/manage-entries";

type Props = {
    dbAddress: string;
    dbName: string;
    onRefresh: () => void;
    onEntryAdded: (key: string) => void;
}

export default function FeedStoreController({ dbName, onRefresh, onEntryAdded }: Props) {

    const [ value, setValue ] = useState('');
    const [ strictMode, setStrictMode ] = useState(true);
    const [ pinData, setPinData ] = useState(false);
    const [ disableInput, setDisableInput ] = useState(false);
    const { store } = useSiteState();
    const toast = useToast();

    const dispatch = useAppLogDispatch();

    const handleAddEntry = async () => {

        try {

            if (!store)
                return;

            if (!value) {
                toast.closeAll();
                toast({
                    position: 'top-right',
                    description: "Please provide a value",
                    status: "error",
                    isClosable: true,
                });
                return;
            }

            if (strictMode && !isValidJson(value)) {
                toast.closeAll();
                toast({
                    position: 'top-right',
                    description: "Invalid JSON",
                    status: "error",
                    isClosable: true,
                });

                return;
            }

            //* This is the data we want to add to the db, it up to you to shape it, here is an example:
            const input = {
                document: strictMode ? JSON.parse(value) : value,
                strictMode: strictMode,
                pin: pinData,
                timestamp: Date.now()
            }

            const hash = await addEntry(store, { pin: pinData, entry: input });

            onEntryAdded(hash);
            dispatch({
                type: 'add',
                log: {
                    id: hash,
                    text: `Feed added to \`${dbName}\` db`,
                    type: 'created'
                }
            });
        }
        catch (error: any) {

            toast.closeAll();
            toast({
                status: 'error',
                title: 'Error',
                description: 'Failed to add entry, please check output for more details',
                isClosable: true,
            });

            dispatch({
                type: 'add',
                log: {
                    text: `Failed to add feed to \`${dbName}\` db - ${error?.message || 'something went wrong'}`,
                    type: 'error'
                }
            });
        }
    }

    const handleSetDocument = (document: string) => {
        setValue(document);
    }

    return (
        <Stack spacing={4}>
            <Stack
                spacing={4}
                direction={{ base: 'column', md: 'row' }}
                alignContent='center'
                alignItems="center"
            >
                <Stack
                    spacing={4}
                    width="full"
                >
                    <InputGroup>
                        <Textarea
                            placeholder="Document or Plain Text"
                            variant={"outline"}
                            value={value}
                            disabled={disableInput}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <InputRightElement
                            w={{ base: 'unset', md: 'auto' }}
                            p={1}
                        >
                            <EditJsonDocument
                                json={value}
                                onAccept={handleSetDocument}
                            >
                                <Button
                                    variant='solid'
                                    color="white"
                                    colorScheme="blackAlpha"
                                    h='1.75rem'
                                >
                                    {value ? 'Edit JSON' : 'Enter JSON'}
                                </Button>
                            </EditJsonDocument>
                        </InputRightElement>
                    </InputGroup>
                </Stack>
                <Checkbox
                    isChecked={pinData}
                    width={{ base: '100%', md: 'auto' }}
                    onChange={(e) => {
                        setPinData(e.target.checked);
                    }}
                >
                    Pin
                </Checkbox>
                <Checkbox
                    isChecked={strictMode}
                    width={{ base: '100%', md: 'auto' }}
                    onChange={(e) => {
                        setStrictMode(e.target.checked);
                        setDisableInput(e.target.checked);
                    }}
                >
                    Strict JSON
                </Checkbox>
            </Stack>
            <Stack
                spacing={4}
                direction={{ base: 'column', md: 'row' }}
            >
                <Spacer />
                <Button
                    variant={"outline"}
                    onClick={onRefresh}
                >
                    Regresh
                </Button>
                <Button
                    variant={"outline"}
                    onClick={handleAddEntry}
                >
                    Add Entry
                </Button>
            </Stack>
        </Stack >
    );
}