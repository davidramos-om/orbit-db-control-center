import { forwardRef } from 'react'
import { TableVirtuoso } from "react-virtuoso";
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, useColorModeValue } from '@chakra-ui/react';

export type EventLogModel = {
    id: string;
    date: Date;
    value: string;
}

type Props = {
    entries: EventLogModel[];
}

const TableComponents = {
    Table: (props: any) => <Table {...props} />,
    TableHead: Thead,
    TableRow: Tr,
    TableCaption: TableCaption,
    TableContainer: TableContainer,
    TableBody: forwardRef((props, ref) => <Tbody {...props} ref={ref as any} />),
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
                    <Th w={100}>#</Th>
                    <Th w={200}>Id</Th>
                    <Th w={230}>Date</Th>
                    <Th w="calc(100% - 530px)">Value</Th>
                </Tr>
            )}
            itemContent={(index, log: EventLogModel) => (
                <>
                    <Td w={100} textAlign="center" > {index}</Td>
                    <Td w={200}>{log.id}</Td>
                    <Td w={230}>{log.date.toLocaleString()}</Td>
                    <Td w="calc(100% - 530px)">{log.value}</Td>
                </>
            )}
        />
    );
}


