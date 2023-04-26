import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Heading, Stack, Text, Progress } from "@chakra-ui/react";

import DbHeaderCard from "#/blocks/DbHeader";
import { useAppLogDispatch } from "#/context/LogsContext";
import { DatabasePageProvider } from "#/context/PageContexts";
import { useSiteStateDispatch, useSiteState } from "#/context/SiteContext";
import { useAppDb } from "#/context/DBsContext";
import { showAlert } from "#/utils/SweetAlert2";
import { addEntry, fetchEntries } from "#/lib/manage-entries";
import { getOneDatabase } from "#/lib/manage-dbs";

import IncrementerControl from "./IncrementerController";

export default function CounterDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const dispatch = useAppLogDispatch();
    const siteDispatcher = useSiteStateDispatch();
    const { store } = useSiteState();
    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ counter, setCounter ] = useState(0);

    useEffect(() => {

        if (!dbAddress)
            return;

        const fetDbStore = async () => {

            const _store = await getOneDatabase({ address: dbAddress, load: true });
            if (!_store)
                return;

            siteDispatcher({ type: 'setStore', value: _store });
        }

        fetDbStore();

    }, [ dbAddress, siteDispatcher ]);

    useEffect(() => {

        return () => {
            siteDispatcher({ type: 'setStore', value: null });
        }
    }, [ siteDispatcher ]);

    const readCounter = useCallback(async () => {

        try {

            if (!store)
                return;

            setLoading(true);
            const counter = await fetchEntries(store, {});
            setCounter(Number(counter || 0));
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }

    }, [ store ]);

    useEffect(() => {
        readCounter();
    }, [ readCounter ]);


    const handleIncrement = async (value: number, pin: boolean) => {

        if (Number(value || 0) <= 0) {
            showAlert({
                text: "Please enter a valid number",
                icon: "error"
            });
            return;
        }

        if (!store)
            return;

        const hash = await addEntry(store, { pin, entry: { value: value } });
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
        <DatabasePageProvider onReplicated={readCounter}>
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
                        {loading && <Progress size='xs' isIndeterminate />}
                        <Heading fontSize={"sm"} mb={2}>
                            Increment the value of the counter by:
                        </Heading>
                        <IncrementerControl onIncrement={handleIncrement} />
                    </CardBody>
                </Card>
            </Stack>
        </DatabasePageProvider>
    );
}