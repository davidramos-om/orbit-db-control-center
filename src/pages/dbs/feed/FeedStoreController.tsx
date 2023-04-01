import { useState } from "react";
import { Button, useToast, Stack, Checkbox, InputGroup, InputRightElement, Spacer, Textarea } from "@chakra-ui/react";

import EditJsonDocument from "src/blocks/EditJsonDocument";
import { useAppLogDispatch } from "src/context/logs-reducer";
import { isValidJson } from "src/utils/helper";
import { addEntry } from "src/lib/db";

type Props = {
    dbAddress: string;
    dbName: string;
    onRefresh: () => void;
    onEntryAdded: (key: string) => void;
}

export default function FeedStoreController({ dbAddress, dbName, onRefresh, onEntryAdded }: Props) {

    const [ value, setValue ] = useState('');
    const [ strictMode, setStrictMode ] = useState(true);
    const [ disableInput, setDisableInput ] = useState(false);
    const toast = useToast();

    const dispatch = useAppLogDispatch();

    const handleAddEntry = async () => {

        try {

            if (!dbAddress)
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
                timestamp: Date.now()
            }

            const hash = await addEntry(dbAddress, { pin: false, entry: input });

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