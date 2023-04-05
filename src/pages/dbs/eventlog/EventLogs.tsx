import { TableVirtuoso } from "react-virtuoso";
import { Tr, Th, Td, useColorModeValue } from '@chakra-ui/react';

import { TableComponents } from '#/components/Table/Virtuoso'
import ShowEntryPayload from '#/blocks/ShowPayload';

export type EventLogModel = {
    id: string;
    date: Date;
    value: string;
    payload: any;
}

type Props = {
    entries: EventLogModel[];
}


export default function EventLogs({ entries }: Props) {

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
            itemContent={(index, log: EventLogModel) => (
                <>
                    <Td w={100} textAlign="center" > {index}</Td>
                    <Td w={50} textAlign="center" >
                        <ShowEntryPayload payload={log.payload} />
                    </Td>
                    <Td w={200}>
                        {log.id}
                    </Td>
                    <Td w={230}>{log.date.toLocaleString()}</Td>
                    <Td w="calc(100% - 590px)">{log.value}</Td>
                </>
            )}
        />
    );
}


