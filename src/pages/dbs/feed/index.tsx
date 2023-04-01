import { useEffect, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack } from "@chakra-ui/react";

import { ShowLoading, StopLoading } from "src/utils/SweetAlert2";
import { useAppDb } from "src/context/dbs-reducer";
import useIsMounted from "src/hooks/useIsMounted";
import DbHeaderCard from "src/blocks/DbHeader";
import { fetchEntries } from "src/lib/db";

import FeedStoreControl from './FeedStoreController';
import FeedLogs, { FeedStoreModel } from './FeedLog';

export default function FeedDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const [ entries, setEntries ] = useState<FeedStoreModel[]>([]);
    const isMounted = useIsMounted();

    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);

    const fetchData = useCallback(async (restar: boolean, showLoader: boolean) => {
        try {

            if (!dbAddress)
                return;

            if (showLoader)
                ShowLoading({ title: 'Loading feed log...' });

            const _entries = await fetchEntries(dbAddress, {
                docsOptions: { fullOp: true },
                query: { reverse: true, limit: -1 }
            });

            if (!_entries)
                return;

            const data = _entries.map((e: any) => {

                const _entry = e.payload.value || {};
                let preview = '';
                if (typeof _entry.document !== 'object')
                    preview = String(_entry.document);
                else
                    preview = JSON.stringify(e.payload.value.document, null, 2);

                preview = preview.substring(0, 100) + '...';

                const _log: FeedStoreModel = {
                    hash: String(e.hash || ''),
                    date: new Date(_entry.timestamp || 0),
                    jsonPreview: preview,
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
                    <FeedLogs
                        dbAddress={dbAddress || ''}
                        entries={entries || []}
                    />
                </CardBody>
            </Card>
        </Stack >
    );
}