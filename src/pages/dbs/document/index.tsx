import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, Stack } from "@chakra-ui/react";

import { useAppDb } from "#/context/dbs-reducer";
import useIsMounted from "#/hooks/useIsMounted";
import { ShowLoading, StopLoading } from "#/utils/SweetAlert2";
import { fetchEntries } from "#/lib/manage-entries";

import DbHeaderCard from "#/blocks/DbHeader";
import DocumentStoreControl from './DocumentStoreController';
import DocumentLogs, { DocStoreModel } from './DocumentsLog';

export default function DocumentDbPage() {

    const { id } = useParams();
    const { findDb } = useAppDb();
    const [ entries, setEntries ] = useState<DocStoreModel[]>([]);
    const isMounted = useIsMounted();

    const dbEntry = useMemo(() => findDb(id || ''), [ id, findDb ]);
    const dbAddress = useMemo(() => dbEntry?.payload.value.address, [ dbEntry ]);

    const fetchData = useCallback(async (restar: boolean, showLoader: boolean) => {
        try {

            if (!dbAddress)
                return;

            if (showLoader)
                ShowLoading({ title: 'Loading docstore log...' });

            const _entries = await fetchEntries(dbAddress, {
                dbInstance: null,
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

                const _log: DocStoreModel = {
                    id: String(_entry._id),
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
                        Add a document to the database
                    </Heading>
                    <DocumentStoreControl
                        onEntryAdded={handleEntryAdded}
                        onRefresh={handleRefresh}
                        dbAddress={dbAddress || ''}
                        dbName={dbEntry?.payload.value.name || ''}
                    />
                    <br />
                </CardHeader>
                <CardBody>
                    <DocumentLogs
                        dbAddress={dbAddress || ''}
                        entries={entries || []}
                    />
                </CardBody>
            </Card>
        </Stack >
    );
}