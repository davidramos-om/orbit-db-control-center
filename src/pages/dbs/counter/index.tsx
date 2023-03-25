import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import { Box, Card, CardBody, CardHeader, Heading, Stack, Text } from "@chakra-ui/react";

import DbHeaderCard from "src/blocks/DbHeader";
import { useAppLogDispatch } from "src/context/logs-reducer";
import Incrementer from "./Incrementer";
import { addEntry, fetchDb, getDB } from "src/lib/db";
import { showAlert } from "src/utils/SweetAlert2";
import { useAppDb } from "src/context/dbs-reducer";

export default function CounterDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const dispatch = useAppLogDispatch();
    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);

    const [ counter, setCounter ] = useState(0);

    useEffect(() => {
        readCounter();
    }, []);


    const readCounter = useCallback(async () => {

        if (!dbEntry)
            return;

        const counter = await fetchDb(dbEntry.payload.value.address, {});
        setCounter(Number(counter || 0));


    }, [ dbEntry ]);

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
            type: 'added',
            log: {
                done: true,
                id: hash,
                text: `Incremented counter by ${value}`,
                type: 'created'
            }
        });

        await readCounter();
    }

    return (
        <Stack spacing={4}>
            <DbHeaderCard multiHash={id || ''} />
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
                    <Incrementer onIncrement={handleIncrement} />
                </CardBody>
            </Card>
        </Stack >
    );
}