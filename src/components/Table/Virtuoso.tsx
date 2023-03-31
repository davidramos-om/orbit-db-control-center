import { forwardRef } from 'react'
import { Table, Thead, Tbody, Tr, TableCaption, TableContainer } from '@chakra-ui/react';

const TableComponents = {
    Table: (props: any) => <Table {...props} />,
    TableHead: Thead,
    TableRow: Tr,
    TableCaption: TableCaption,
    TableContainer: TableContainer,
    TableBody: forwardRef((props, ref) => <Tbody {...props} ref={ref as any} />),
}

export {
    TableComponents
}