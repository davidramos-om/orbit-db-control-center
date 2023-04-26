import { useMemo, useEffect, useCallback, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack, Progress } from "@chakra-ui/react";

import DbHeaderCard from "#/blocks/DbHeader";
import { useAppDb } from "#/context/DBsContext";
import { DatabasePageProvider } from "#/context/PageContexts";
import { useSiteStateDispatch, useSiteState } from "#/context/SiteContext";
import useIsMounted from "#/hooks/useIsMounted";
import { fetchEntries, fetchEntry } from "#/lib/manage-entries";
import { getOneDatabase } from "#/lib/manage-dbs";

import EventLogStoreControl from './LogStoreController';
import EventLogs, { EventLogModel } from './EventLogs';

export default function EventLogDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const siteDispatcher = useSiteStateDispatch();
    const { store } = useSiteState();
    const [ entries, setEntries ] = useState<EventLogModel[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const isMounted = useIsMounted();

    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);

    useEffect(() => {

        if (!dbAddress)
            return;

        const fetDbStore = async () => {

            const _store = await getOneDatabase({ address: dbAddress, load: false });
            if (!_store)
                return;

            siteDispatcher({ type: 'setStore', value: _store });
        }

        fetDbStore();

        return () => {
            siteDispatcher({ type: 'setStore', value: null });
        }

    }, [ dbAddress, siteDispatcher ]);

    const fetchData = useCallback(async (restar: boolean) => {
        try {

            if (!store)
                return;

            setLoading(true);

            const _entries = await fetchEntries(store, { query: { reverse: true, limit: -1 } });
            if (!_entries)
                return;

            const data = _entries.map((e: any) => {

                const _log: EventLogModel = {
                    id: String(e.hash),
                    date: new Date(e.payload.value?.timestamp || 0),
                    value: String(e.payload.value?.value || e.payload.value),
                    payload: e
                };

                return _log;
            });

            if (!isMounted())
                return;

            if (restar)
                setEntries(data);
            else {
                setEntries((prev) => {
                    return [
                        ...prev,
                        ...data
                    ]
                });
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }, [ store, isMounted ]);

    useEffect(() => {
        fetchData(true);
    }, [ fetchData ]);


    const handleRefresh = useCallback(async () => {
        try {
            await fetchData(true);
        }
        catch (error) {
            console.error(error);
        }
    }, [ fetchData ]);

    const handleAddEvent = useCallback(async (hash: string) => {
        try {

            if (!store)
                return;

            if (!hash)
                return;

            const entry = await fetchEntry(store, hash);
            if (!entry)
                return;

            const _log: EventLogModel = {
                id: String(entry.hash),
                date: new Date(entry.payload.value?.timestamp || 0),
                value: String(entry.payload.value?.value || entry.payload.value),
                payload: entry
            };

            setEntries((prev) => {
                return [
                    _log,
                    ...prev
                ]
            });
        }
        catch (error) {
            console.error(error);
        }
    }, [ store ]);


    return (
        <DatabasePageProvider onReplicated={handleRefresh}>
            <Stack spacing={4}>
                <DbHeaderCard
                    multiHash={id || ''}
                    entriesCount={entries.length}
                    showEntriesCount={true}
                />
                <Card
                >
                    <CardHeader>
                        <Heading fontSize={"sm"} mb={2}>
                            Add an immutable event to the log
                        </Heading>
                        <EventLogStoreControl
                            onAddEvent={handleAddEvent}
                            onRefresh={handleRefresh}
                        />
                        <br />
                    </CardHeader>
                    <CardBody>
                        {loading && <Progress size='xs' isIndeterminate />}
                        <EventLogs entries={entries || []} />
                    </CardBody>
                </Card>
            </Stack >
        </DatabasePageProvider>
    );
}