import { useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Input, Stack, Checkbox, useToast } from "@chakra-ui/react";

import { useAppDb } from "#/context/dbs-reducer";
import { useAppLogDispatch } from "#/context/logs-reducer";
import { addEntry } from "#/lib/manage-entries"; 

type Props = {
    onRefresh: () => void;
    onAddEvent: (hash: string) => void;
}

export default function EventLogStoreController({ onRefresh, onAddEvent }: Props) {

    const [ value, setValue ] = useState('');
    const [ pinData, setPinData ] = useState(false);
    const { id } = useParams();
    const { findDb } = useAppDb();
    const dispatch = useAppLogDispatch();
    const toast = useToast()
    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);

    const handleAddEvent = async () => {

        try {

            if (!value)
                return;

            if (!dbEntry)
                return;

            //* This is the data we want to add to the db, it up to you to shape it, here is an example:
            const input = {
                value: value,
                pin: pinData,
                timestamp: Date.now()
            }

            const hash = await addEntry(dbEntry.payload.value.address, { pin: pinData, entry: input });

            onAddEvent(hash);
            dispatch({
                type: 'add',
                log: {
                    id: hash,
                    text: `Added event  to \`${dbEntry?.payload.value.name}\` db`,
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
                    text: `Failed to add event to \`${dbEntry?.payload.value.name}\` db - ${error?.message || 'unknown error'}`,
                    type: 'error'
                }
            });
        }
    }

    return (
        <Stack
            spacing={4}
            direction={{ base: 'column', md: 'row' }}
        >
            <Input
                variant={"outline"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
            </Input>
            <Checkbox
                isChecked={pinData}
                width={{ base: '100%', md: 'auto' }}
                onChange={(e) => {
                    setPinData(e.target.checked);
                }}
            >
                Pin
            </Checkbox>
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
                Add event
            </Button>
        </Stack>
    );
}