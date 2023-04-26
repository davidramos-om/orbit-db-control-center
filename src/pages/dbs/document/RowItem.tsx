import { useCallback, useState } from "react";
import { Td, HStack } from "@chakra-ui/react";

import ShowEntryPayload from '#/blocks/ShowPayload';
import DeleteEntry from '#/blocks/DeleteEntryButton';
import { useAppLogDispatch } from '#/context/LogsContext';
import { useSiteState } from "#/context/SiteContext";
import { removeEntry } from "#/lib/manage-entries";
import { DocStoreModel } from "./DocumentsLog";

export type RowItemProps = {
    index: number;
    dbAddress: string;
    log: DocStoreModel;
}

export function RowItem({ index, dbAddress, log }: RowItemProps) {

    const [ deleted, setDeleted ] = useState(false);
    const dispatch = useAppLogDispatch();
    const { store } = useSiteState();

    const handleDelete = useCallback(async () => {
        try {

            if (!store)
                return;

            await removeEntry(store, log.id);
            dispatch({
                type: 'add',
                log: {
                    type: 'deleted',
                    text: `Entry ${log.id} deleted from ${store.address.path}`
                }
            });

            setDeleted(true);
        }
        catch (error: any) {
            dispatch({
                type: 'add',
                log: {
                    type: 'error',
                    text: `Error deleting entry ${log.id} from ${store?.address?.path || ''}: ${error.message}`
                }
            });
        }
    }, [ store, dispatch, log.id ]);

    const sxStyle = {
        textDecoration: deleted ? 'line-through' : 'none',
        opacity: deleted ? 0.5 : 1
    };

    return (
        <>
            <Td w={100} textAlign="center"> {index}</Td>
            <Td w={50} textAlign="center">
                <HStack>
                    <ShowEntryPayload payload={log.payload} />
                    <DeleteEntry
                        dbAddress={dbAddress}
                        identifier={log.id}
                        onDelete={handleDelete} />
                </HStack>
            </Td>
            <Td w={200} sx={sxStyle}>
                {log.id}
            </Td>
            <Td w={230} sx={sxStyle}>{log.date.toLocaleString()}</Td>
            <Td w="calc(100% - 590px)" sx={sxStyle}>{log.jsonPreview}</Td>
        </>
    );
}
