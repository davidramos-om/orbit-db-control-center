import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Divider,
} from '@chakra-ui/react'

import { ViewIcon, DeleteIcon, CloseIcon, SettingsIcon } from '@chakra-ui/icons'

type DataTableProps = {
    title: string,
    rows: any[]
}

export default function DataTable({ rows, title }: DataTableProps) {

    return (
        <TableContainer>
            <Table
                variant='simple'
            >
                <TableCaption placement="top">
                    {title}
                </TableCaption>
                <Thead>
                    <Tr>
                        <Th>
                            <ViewIcon />
                        </Th>
                        <Th>NAME</Th>
                        <Th>TYPE</Th>
                        <Th>ADDRESS</Th>
                        <Th>DATE</Th>
                        <Th>
                            <DeleteIcon />
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {rows.map((row) => (
                        <Tr key={row.id}>
                            <Td>
                                <SettingsIcon />
                            </Td>
                            <Td>{row.name}</Td>
                            <Td>{row.type}</Td>
                            <Td>{row.address}</Td>
                            <Td>{row.date}</Td>
                            <Td>
                                <CloseIcon color="red.500" />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}