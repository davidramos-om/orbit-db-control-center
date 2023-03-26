import { useMemo, useEffect, useCallback, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack } from "@chakra-ui/react";

import DbHeaderCard from "src/blocks/DbHeader";
import { useAppDb } from "src/context/dbs-reducer";
import useIsMounted from "src/hooks/useIsMounted";
import { fetchEntries } from "src/lib/db";
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

            ShowLoading({});
            const _entries = await fetchEntries(dbAddress, { query: { reverse: true, limit: -1 } });
            if (!_entries)
                return;

            const data = _entries.map((e: any) => ({
                id: String(e.hash),
                date: new Date(e.payload.value?.timestamp || 0),
                value: String(e.payload.value?.value || e.payload.value)
            }));

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
    }, [ dbAddress ]);

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