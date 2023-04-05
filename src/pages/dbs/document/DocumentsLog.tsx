import { TableVirtuoso } from "react-virtuoso";
import { Tr, Th, useColorModeValue } from "@chakra-ui/react";

import { TableComponents } from '#/components/Table/Virtuoso';
import { RowItem } from "./RowItem";

export type DocStoreModel = {
    id: string;
    date: Date;
    jsonPreview: string;
    payload: any;
}

type Props = {
    dbAddress: string;
    entries: DocStoreModel[];
}

export default function DocumentsLog({ dbAddress, entries }: Props) {

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
                <RowItem
                    key={log.id}
                    index={index}
                    dbAddress={dbAddress}
                    log={log}
                />
            )}
        />
    );
}