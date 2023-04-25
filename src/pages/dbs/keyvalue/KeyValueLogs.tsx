import { forwardRef } from 'react'
import { TableVirtuoso } from "react-virtuoso";
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, useColorModeValue } from '@chakra-ui/react';

import ShowEntryPayload from '#/blocks/ShowPayload';

export type KeyValueModel = {
    date: Date;
    key: string;
    value: string;
    payload: any;
}

type Props = {
    entries: KeyValueModel[];
}

const TableComponents = {
    Table: (props: any) => <Table {...props} />,
    TableHead: Thead,
    TableRow: Tr,
    TableCaption: TableCaption,
    TableContainer: TableContainer,
    TableBody: forwardRef((props, ref) => <Tbody {...props} ref={ref as any} />),
}

export default function KeyValueLogs({ entries }: Props) {

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
                    <Th w={100} textAlign="center">{`{ }`}</Th>
                    <Th w={230}>Date</Th>
                    <Th w={230}>Key</Th>
                    <Th w="calc(100% - 630px)">Value</Th>
                </Tr>
            )}
            itemContent={(index, log: KeyValueModel) => (
                <>
                    <Td w={100} textAlign="center" > {index + 1}</Td>
                    <Td w={100} textAlign="center" >
                        <ShowEntryPayload payload={log.payload} />
                    </Td>
                    <Td w={230}>{log.date.toLocaleString()}</Td>
                    <Td w={230}>{log.key}</Td>
                    <Td w="calc(100% - 630px)">{log.value}</Td>
                </>
            )}
        />
    );
}

