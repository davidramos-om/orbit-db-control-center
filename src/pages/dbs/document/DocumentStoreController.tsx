import { useState } from "react";
import { Button, useToast, Stack, Checkbox, InputGroup, InputRightElement, Spacer, Textarea } from "@chakra-ui/react";

import EditJsonDocument from "#/blocks/EditJsonDocument";
import { useAppLogDispatch } from "#/context/logs-reducer";
import { addEntry } from "#/lib/manage-entries";
import { isValidJson } from "#/utils/helper";


type Props = {
    dbAddress: string;
    dbName: string;
    onRefresh: () => void;
    onEntryAdded: (key: string) => void;
}

export default function DocStoreController({ dbAddress, dbName, onRefresh, onEntryAdded }: Props) {

    const [ value, setValue ] = useState('');
    const [ id, setId ] = useState('');
    const [ strictMode, setStrictMode ] = useState(true);
    const [ disableInput, setDisableInput ] = useState(false);
    const [ pinData, setPinData ] = useState(false);
    const toast = useToast();

    const dispatch = useAppLogDispatch();

    const handleAddEntry = async () => {

        try {

            if (!dbAddress)
                return;

            if (!id || !value) {
                toast.closeAll();
                toast({
                    position: 'top-right',
                    description: "Please provide an id and a json document",
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

            //* if value is a valid json, parse it, if property "_id" is not set, set it to the id
            let jsonDocument = {};
            if (isValidJson(value)) {

                const json = JSON.parse(value);
                if (!json._id)
                    json._id = id;

                jsonDocument = { ...json };
            }
            else {
                const json = { _id: id, value: value };
                jsonDocument = { ...json };
            }

            //* This is the data we want to add to the db, it up to you to shape it, here is an example:
            const input = {
                _id: id,
                document: jsonDocument,
                strictMode: strictMode,
                pin: pinData,
                timestamp: Date.now()
            }

            const hash = await addEntry(dbAddress, { pin: pinData, entry: input });
            onEntryAdded(id);
            dispatch({
                type: 'add',
                log: {
                    id: hash,
                    text: `Document added to \`${dbName}\` db`,
                    type: 'created'
                }
            });
        }
        catch (error: any) {
            dispatch({
                type: 'add',
                log: {
                    text: `Failed to add document to \`${dbName}\` db - ${error?.message || 'something went wrong'}`,
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
                <Textarea
                    placeholder="_id"
                    variant={"outline"}
                    value={id}
                    width={{ base: '100%', md: 'auto' }}
                    onChange={(e) => setId(e.target.value)}
                />
                <Stack
                    spacing={4}
                    width="full"
                >
                    <InputGroup>
                        <Textarea
                            placeholder="Document"
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
                    Put Document
                </Button>
            </Stack>
        </Stack >
    );
}