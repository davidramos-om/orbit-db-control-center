import { useCallback, useState } from "react";
import { Td, HStack } from "@chakra-ui/react";

import ShowEntryPayload from '#/blocks/ShowPayload';
import DeleteEntry from '#/blocks/DeleteEntryButton';
import { useAppLogDispatch } from '#/context/LogsContext';
import { useSiteState } from "#/context/SiteContext";
import { removeEntry } from "#/lib/manage-entries";
import { FeedStoreModel } from "./FeedLog";

export type RowItemProps = {
    index: number;
    dbAddress: string;
    log: FeedStoreModel;
}

export function RowItem({ index, dbAddress, log }: RowItemProps) {

    const [ deleted, setDeleted ] = useState(false);
    const dispatch = useAppLogDispatch();
    const { store } = useSiteState();

    const handleDelete = useCallback(async () => {
        try {

            if (!store)
                return;

            await removeEntry(store, log.hash);
            dispatch({
                type: 'add',
                log: {
                    type: 'deleted',
                    text: `Entry ${log.hash} deleted from ${dbAddress}`
                }
            });

            setDeleted(true);
        }
        catch (error: any) {
            dispatch({
                type: 'add',
                log: {
                    type: 'error',
                    text: `Error deleting entry ${log.hash} from ${dbAddress}: ${error.message || 'something went wrong'}`
                }
            });
        }
    }, [ store, dbAddress, dispatch, log.hash ]);

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
                        identifier={log.hash}
                        onDelete={handleDelete} />
                </HStack>
            </Td>
            <Td w={200} sx={sxStyle}>
                {log.hash}
            </Td>
            <Td w={230} sx={sxStyle}>{log.date.toLocaleString()}</Td>
            <Td w="calc(100% - 590px)" sx={sxStyle}>{log.jsonPreview}</Td>
        </>
    );
}
