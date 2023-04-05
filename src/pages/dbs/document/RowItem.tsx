import { useCallback, useState } from "react";
import { Td, HStack } from "@chakra-ui/react";

import ShowEntryPayload from '#/blocks/ShowPayload';
import DeleteEntry from '#/blocks/DeleteEntryButton';
import { useAppLogDispatch } from '#/context/logs-reducer';
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

    const handleDelete = useCallback(async () => {
        try {

            await removeEntry(dbAddress, log.id);
            dispatch({
                type: 'add',
                log: {
                    type: 'deleted',
                    text: `Entry ${log.id} deleted from ${dbAddress}`
                }
            });

            setDeleted(true);
        }
        catch (error: any) {
            dispatch({
                type: 'add',
                log: {
                    type: 'error',
                    text: `Error deleting entry ${log.id} from ${dbAddress}: ${error.message}`
                }
            });
        }
    }, [ dbAddress, dispatch, log.id ]);

    const sxStyle = {
        textDecoration: deleted ? 'line-through' : 'none',
        opacity: deleted ? 0.5 : 1
    };

    return (
        <>
            <Td w={100} textAlign="center"> {index + 1}</Td>
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
