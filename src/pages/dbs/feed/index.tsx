import { useEffect, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack, Progress } from "@chakra-ui/react";

import { useAppDb } from "#/context/DBsContext";
import { DatabasePageProvider } from "#/context/PageContexts";
import { useSiteStateDispatch, useSiteState } from "#/context/SiteContext";
import useIsMounted from "#/hooks/useIsMounted";
import DbHeaderCard from "#/blocks/DbHeader";
import { fetchEntries } from "#/lib/manage-entries";
import { getOneDatabase } from "#/lib/manage-dbs";

import FeedStoreControl from './FeedStoreController';
import FeedLogs, { FeedStoreModel } from './FeedLog';

function mapStoreEntryToPageEntry(e: any) {

    const _entry = e.payload.value || {};
    let preview = '';
    if (typeof _entry.document !== 'object')
        preview = String(_entry.document);

    else
        preview = JSON.stringify(e.payload.value.document, null, 2);

    preview = preview.length > 100 ? preview.substring(0, 100) + '...' : preview;

    const _log: FeedStoreModel = {
        hash: String(e.hash || ''),
        date: new Date(_entry.timestamp || 0),
        jsonPreview: preview,
        payload: e
    };
    return _log;
}


export default function FeedDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const siteDispatcher = useSiteStateDispatch();
    const { store } = useSiteState();
    const [ entries, setEntries ] = useState<FeedStoreModel[]>([]);
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

    }, [ dbAddress, siteDispatcher ]);


    const fetchData = useCallback(async (restar: boolean, showLoader: boolean) => {
        try {

            if (!store)
                return;

            if (showLoader)
                setLoading(true);

            const _entries = await fetchEntries(store, {
                docsOptions: { fullOp: true },
                query: { reverse: true, limit: -1 }
            });

            if (!_entries)
                return;

            const data = _entries.map((e: any) => mapStoreEntryToPageEntry(e));
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
        fetchData(false, true);
    }, [ fetchData ]);


    const handleRefresh = useCallback(async () => {
        try {
            await fetchData(true, true);
        }
        catch (error) {
            console.error(error);
        }
    }, [ fetchData ]);

    const handleEntryAdded = useCallback(() => {
        fetchData(true, false);
    }, [ fetchData ]);

    return (
        <DatabasePageProvider onReplicated={handleRefresh}>
            <Stack spacing={4}>
                <DbHeaderCard
                    multiHash={id || ''}
                    entriesCount={entries.length}
                    showEntriesCount={true}
                />
                <Card>
                    <CardHeader>
                        <Heading fontSize={"sm"} mb={2}>
                            Add an entry to the feed
                        </Heading>
                        <FeedStoreControl
                            onEntryAdded={handleEntryAdded}
                            onRefresh={handleRefresh}
                            dbAddress={dbAddress || ''}
                            dbName={dbEntry?.payload.value.name || ''}
                        />
                        <br />
                    </CardHeader>
                    <CardBody>
                        {loading && <Progress size='xs' isIndeterminate />}
                        <FeedLogs
                            dbAddress={dbAddress || ''}
                            entries={entries || []}
                        />
                    </CardBody>
                </Card>
            </Stack >
        </DatabasePageProvider>
    );
}
