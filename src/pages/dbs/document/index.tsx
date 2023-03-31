import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack } from "@chakra-ui/react";

import { useAppDb } from "src/context/dbs-reducer";
import useIsMounted from "src/hooks/useIsMounted";
import { ShowLoading, StopLoading } from "src/utils/SweetAlert2";
import { fetchEntries, fetchEntry } from "src/lib/db";

import DbHeaderCard from "src/blocks/DbHeader";
import DocumentStoreControl from './DocumentStoreController';
import DocumentLogs, { DocStoreModel } from './DocumentsLog';

export default function DocumentDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const [ entries, setEntries ] = useState<DocStoreModel[]>([]);
    const isMounted = useIsMounted();

    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);

    const fetchData = useCallback(async (restar: boolean) => {
        try {

            if (!dbAddress)
                return;

            ShowLoading({ title: 'Loading docstore log...' });

            const _entries = await fetchEntries(dbAddress, { query: { reverse: true, limit: -1 } });
            if (!_entries)
                return;

            const data = _entries.map((e: any) => {
                const _log: DocStoreModel = {
                    id: String(e.payload.value?._id || ''),
                    date: new Date(e.payload.value?.timestamp || 0),
                    jsonPreview: String(e.payload.value || '').substring(0, 100),
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

            const _log: DocStoreModel = {
                id: String(entry.hash),
                date: new Date(entry.payload.value?.timestamp || 0),
                jsonPreview: String(entry.payload.value || '').substring(0, 100),
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
                entriesCount={entries.length}
                showEntriesCount={true}
            />
            <Card>
                <CardHeader>
                    <Heading fontSize={"sm"} mb={2}>
                        Add a document to the database
                    </Heading>
                    <DocumentStoreControl
                        onAddEvent={handleAddEvent}
                        onRefresh={handleRefresh}
                        dbAddress={dbAddress || ''}
                        dbName={dbEntry?.payload.value.name || ''}
                    />
                    <br />
                </CardHeader>
                <CardBody>
                    <DocumentLogs entries={entries || []} />
                </CardBody>
            </Card>
        </Stack >
    );
}