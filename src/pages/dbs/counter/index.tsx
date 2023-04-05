import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Heading, Stack, Text } from "@chakra-ui/react";

import DbHeaderCard from "#/blocks/DbHeader";
import { showAlert } from "#/utils/SweetAlert2";
import { useAppDb } from "#/context/dbs-reducer";
import { useAppLogDispatch } from "#/context/logs-reducer";
import { addEntry, fetchEntries } from "#/lib/manage-entries";

import IncrementerControl from "./IncrementerController";

export default function CounterDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const dispatch = useAppLogDispatch();
    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);

    const [ counter, setCounter ] = useState(0);

    const readCounter = useCallback(async () => {

        if (!dbEntry)
            return;

        const counter = await fetchEntries(dbEntry.payload.value.address, {});
        setCounter(Number(counter || 0));

    }, [ dbEntry ]);

    useEffect(() => {
        readCounter();
    }, [ readCounter ]);


    const handleIncrement = async (value: number) => {

        if (Number(value || 0) <= 0) {
            showAlert({
                text: "Please enter a valid number",
                icon: "error"
            });
            return;
        }

        if (!dbEntry)
            return;

        const hash = await addEntry(dbEntry?.payload.value.address, { pin: false, entry: { value: value } });
        dispatch({
            type: 'add',
            log: {
                id: hash,
                text: `Incremented counter by ${value} on \`${dbEntry?.payload.value.name}\` db`,
                type: 'created'
            }
        });

        await readCounter();
    }

    return (
        <Stack spacing={4}>
            <DbHeaderCard
                multiHash={id || ''}
                entriesCount={counter}
                showEntriesCount={true}
            />
            <Card
            >
                <CardHeader>
                    <Text>
                        <b>Count:</b> {counter}
                    </Text>
                    <br />
                </CardHeader>
                <CardBody>
                    <Heading fontSize={"sm"} mb={2}>
                        Increment the value of the counter by:
                    </Heading>
                    <IncrementerControl onIncrement={handleIncrement} />
                </CardBody>
            </Card>
        </Stack>
    );
}