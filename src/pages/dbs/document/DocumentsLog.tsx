import { Tr, Th, Td, useColorModeValue } from "@chakra-ui/react";
import { TableVirtuoso } from "react-virtuoso";

import { TableComponents } from 'src/components/Table/Virtuoso';
import ShowEntryPayload from 'src/blocks/ShowPayload';

export type DocStoreModel = {
    id: string;
    date: Date;
    jsonPreview: string;
    payload: any;
}

type Props = {
    entries: DocStoreModel[];
}

export default function DocumentsLog({ entries }: Props) {

    const trBg = useColorModeValue('gray.200', 'gray.800');

    return (
        <TableVirtuoso
            style={{ height: 400 }}
            data={entries}
            overscan={200}
            components={TableComponents as any}
            fixedHeaderContent={() => (
                <Tr
                    bg={trBg}
                >
                    <Th w={100} textAlign="center" >#</Th>
                    <Th w={60} textAlign="center">{`{ }`}</Th>
                    <Th w={200}>Id</Th>
                    <Th w={230}>Date</Th>
                    <Th w="calc(100% - 590px)">Value</Th>
                </Tr>
            )}
            itemContent={(index, log: DocStoreModel) => (
                <>
                    <Td w={100} textAlign="center" > {index}</Td>
                    <Td w={50} textAlign="center" >
                        <ShowEntryPayload payload={log.payload} />
                    </Td>
                    <Td w={200}>
                        {log.id}
                    </Td>
                    <Td w={230}>{log.date.toLocaleString()}</Td>
                    <Td w="calc(100% - 590px)">{log.jsonPreview}</Td>
                </>
            )}
        />
    );
}