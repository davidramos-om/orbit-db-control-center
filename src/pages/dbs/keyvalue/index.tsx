import { useCallback, useState, useMemo, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack, Progress } from "@chakra-ui/react";

import DbHeaderCard from "#/blocks/DbHeader";
import { useAppDb } from "#/context/DBsContext";
import { useSiteStateDispatch, useSiteState } from "#/context/SiteContext";
import { DatabasePageProvider } from "#/context/PageContexts";
import useIsMounted from "#/hooks/useIsMounted";
import { fetchEntries } from "#/lib/manage-entries";

import KeyValueLogs, { KeyValueModel } from './KeyValueLogs';
import KeyValueStoreControl from './KeyValueController';
import { getOneDatabase } from "#/lib/manage-dbs";


export default function KeyValueDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const siteDispatcher = useSiteStateDispatch();
    const { store } = useSiteState();
    const [ entries, setEntries ] = useState<KeyValueModel[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const isMounted = useIsMounted();

    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);

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



    const fetchData = useCallback(async (restar: boolean) => {
        try {

            if (!store)
                return;

            setLoading(true);
            const _entries = await fetchEntries(store, {
                query: { reverse: true, limit: -1 },
            });


            console.log(store.replicationStatus);

            if (!_entries)
                return;

            console.log(`🐛  -> 🔥 :  fetchData 🔥 :  _entries:`, _entries);
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
            setLoading(false);
        }
    }, [ store, isMounted ]);

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
        <DatabasePageProvider onReplicated={handleRefresh}>
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
                        {loading && <Progress size='xs' isIndeterminate />}
                        <KeyValueLogs entries={entries || []} />
                    </CardBody>
                </Card>
            </Stack >
        </DatabasePageProvider>
    );
}