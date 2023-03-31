import { useState } from "react";
import { Button, Input, Stack, Checkbox, InputGroup, InputRightElement, Spacer, Textarea } from "@chakra-ui/react";

import { useAppLogDispatch } from "src/context/logs-reducer";
import { addEntry } from "src/lib/db";
import { isValidJson } from "src/utils/helper";

import EditJsonDocument from "./EditJsonDocument";

type Props = {
    dbAddress: string;
    dbName: string;
    onRefresh: () => void;
    onAddEvent: (hash: string) => void;
}

export default function DocStoreController({ dbAddress, dbName, onRefresh, onAddEvent }: Props) {

    const [ value, setValue ] = useState('');
    const [ id, setId ] = useState('');
    const [ strictMode, setStrictMode ] = useState(true);
    const [ disableInput, setDisableInput ] = useState(false);

    const dispatch = useAppLogDispatch();

    const handleAddEvent = async () => {

        try {

            if (!value)
                return;

            if (!dbAddress)
                return;

            if (!id || !value)
                return;

            let jsonDocument = value;

            if (strictMode && !isValidJson(value)) {
                dispatch({
                    type: 'add',
                    log: {
                        text: `Failed to add event to \`${dbName}\` db - Invalid JSON`,
                        type: 'error'
                    }
                });


                return;
            }

            //* if value is a valid json, parse it, if property "_id" is not set, set it to the id
            if (isValidJson(value)) {

                const json = JSON.parse(value);
                if (!json._id)
                    json._id = id;

                jsonDocument = JSON.stringify(json);
            }
            else {
                const json = { _id: id, value: value };
                jsonDocument = JSON.stringify(json);
            }

            console.log({ jsonDocument });

            //* This is the data we want to add to the db, it up to you to shape it, here is an example:
            const input = {
                _id: id,
                document: jsonDocument,
                strictMode: strictMode,
                timestamp: Date.now()
            }

            const hash = await addEntry(dbAddress, { pin: false, entry: input });

            onAddEvent(hash);
            dispatch({
                type: 'add',
                log: {
                    id: hash,
                    text: `Added event  to \`${dbName}\` db`,
                    type: 'created'
                }
            });
        }
        catch (error: any) {
            dispatch({
                type: 'add',
                log: {
                    text: `Failed to add event to \`${dbName}\` db - ${error?.message || 'unknown error'}`,
                    type: 'error'
                }
            });
        }
    }

    const handleSetDocument = (document: string) => {
        setValue(document);
    }

    return (
        <Stack
            spacing={4}
        >
            <Stack
                spacing={4}
                direction={{ base: 'column', md: 'row' }}
                alignContent='center'
                alignItems="center"
            >
                <Input
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
                    onClick={handleAddEvent}
                >
                    Put Document
                </Button>
            </Stack>
        </Stack >
    );
}