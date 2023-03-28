import { useCallback, useState, useMemo, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack } from "@chakra-ui/react";

import DbHeaderCard from "src/blocks/DbHeader";
import { useAppDb } from "src/context/dbs-reducer";
import useIsMounted from "src/hooks/useIsMounted";
import { fetchEntries } from "src/lib/db";
import { ShowLoading, StopLoading } from "src/utils/SweetAlert2";

import KeyValueLogs, { KeyValueModel } from './KeyValueLogs';
import KeyValueStoreControl from './KeyValueController';


export default function KeyValueDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const [ entries, setEntries ] = useState<KeyValueModel[]>([]);
    const isMounted = useIsMounted();

    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);

    const fetchData = useCallback(async (restar: boolean) => {
        try {

            if (!dbAddress)
                return;

            ShowLoading({ title: 'Loading key values log...' });

            const _entries = await fetchEntries(dbAddress, { query: { reverse: true, limit: -1 } });
            if (!_entries)
                return;

            const data = _entries.map((e: any) => {
                const _log: KeyValueModel = {
                    date: new Date(e.payload.value?.timestamp || 0),
                    key: String(e.payload?.key || ''),
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

    const handleAddEvent = useCallback(async (key: string) => {
        handleRefresh();
    }, [ handleRefresh ]);

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
                        Set a value for a key
                    </Heading>
                    <KeyValueStoreControl
                        onAddEvent={handleAddEvent}
                        onRefresh={handleRefresh}
                    />
                    <br />
                </CardHeader>
                <CardBody>
                    <KeyValueLogs entries={entries || []} />
                </CardBody>
            </Card>
        </Stack >
    );
}