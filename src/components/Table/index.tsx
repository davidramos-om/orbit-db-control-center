import { ReactNode } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react';

import { ShortDateDividerHelper } from "src/utils/date-service";

export type DataColumn = {
    name: string;
    selector: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'node'
    headerNode?: ReactNode;
    renderRowNode?: (row: any) => ReactNode;
    onClick?: (row: any) => void;
}

type DataTableProps = {
    caption?: {
        title?: string;
        placement?: 'top' | 'bottom';
        show: boolean;
    },
    keyField: string;
    columns: DataColumn[];
    rows: any[];
}

export default function DataTable({ rows, keyField, columns, caption = { title: '', placement: "top", show: true } }: DataTableProps) {

    return (
        <TableContainer>
            <Table
                variant='simple'
            >
                {caption.show && (
                    <TableCaption placement={caption.placement}>
                        {caption.title}
                </TableCaption>
                )}
                <Thead>
                    <Tr>
                        {columns.map((column) => (
                            <Th key={column.name}>{column.headerNode || column.name}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.map((row) => (
                        <Tr key={row[ keyField ]}>
                            {columns.map((column) => (
                                <Td key={`${row[ keyField ]}_${column.name}`}>
                                    {column.type === 'node' && (column.renderRowNode ? column.renderRowNode(row) : row[ column.selector ])}
                                    {column.type === 'string' && (row[ column.selector ])}
                                    {column.type === 'number' && (row[ column.selector ])}
                                    {column.type === 'date' && (row[ column.selector ] ? ShortDateDividerHelper(row[ column.selector ], true) : '')}
                                    {column.type === 'boolean' && (row[ column.selector ] ? 'Yes' : 'No')}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}