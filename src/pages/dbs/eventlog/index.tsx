import { useMemo, useEffect, useCallback, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack } from "@chakra-ui/react";

import DbHeaderCard from "src/blocks/DbHeader";
import { useAppDb } from "src/context/dbs-reducer";
import useIsMounted from "src/hooks/useIsMounted";
import { fetchEntries, fetchEntry } from "src/lib/db";
import { ShowLoading, StopLoading } from "src/utils/SweetAlert2";

import EventLogStoreControl from './LogStoreController';
import EventLogs, { EventLogModel } from './EventLogs';

export default function EventLogDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const [ entries, setEntries ] = useState<EventLogModel[]>([]);
    const isMounted = useIsMounted();

    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);

    const fetchData = useCallback(async (restar: boolean) => {
        try {

            if (!dbAddress)
                return;

            ShowLoading({
                title: 'Loading event log...',
            });
            const _entries = await fetchEntries(dbAddress, { query: { reverse: true, limit: -1 } });
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
            StopLoading();
        }
    }, [ dbAddress, isMounted ]);

    useEffect(() => {
        fetchData(false);
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

            if (!dbAddress)
                return;

            if (!hash)
                return;

            const entry = await fetchEntry(dbAddress, hash);
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
    }, [ dbAddress ]);


    return (
        <Stack spacing={4}>
            <DbHeaderCard
                multiHash={id || ''}
                entriesCount={0}
                showEntriesCount={false}
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
                    <EventLogs entries={entries || []} />
                </CardBody>
            </Card>
        </Stack >
    );
}