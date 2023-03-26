import { useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Input, Stack } from "@chakra-ui/react";

import { useAppDb } from "src/context/dbs-reducer";
import { useAppLogDispatch } from "src/context/logs-reducer";
import { addEntry } from "src/lib/db";

type Props = {
    onRefresh: () => void;
}

export default function EventLogStoreController({ onRefresh }: Props) {

    const [ value, setValue ] = useState('');
    const { id } = useParams();
    const { findDb } = useAppDb();
    const dispatch = useAppLogDispatch();
    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);

    const handleAddEvent = async () => {

        try {

            if (!value)
                return;

            if (!dbEntry)
                return;

            const hash = await addEntry(dbEntry?.payload.value.address, {
                pin: false, entry: {
                    value: value,
                    timestamp: Date.now()
                }
            });
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