import { useCallback, useMemo } from "react";
import { Badge, IconButton, Stack } from '@chakra-ui/react';
import { ViewIcon, DeleteIcon, CloseIcon, SettingsIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";

import DataTable, { DataColumn } from "#/components/Table";
import { PATH } from '#/routes';

export type DBRow = {
    id: string;
    multiHash: string;
    external: boolean;
    name: string;
    type: string;
    address: string;
    date: Date;
}


type getColumnsArgs = {
    onDelete?: (row: any) => void;
    onOpen?: (row: any) => void;
}

type Colors = {
    [ key: string ]: string
}

export const colorSchema: Colors = {
    'feed': 'green',
    'eventlog': 'blue',
    'keyvalue': 'purple',
    'counter': 'orange',
    'docstore': 'teal',
    'none': 'yellow'
}


const getColumns = ({ onDelete, onOpen }: getColumnsArgs): DataColumn[] => {

    const columns: DataColumn[] = [ {
        name: 'settings',
        selector: '',
        type: 'node',
        headerNode: <ViewIcon boxSize={5} />,
        renderRowNode: (row: any) => <IconButton
            icon={<SettingsIcon color="black.500" boxSize={5} />}
            aria-label="settings"
            size="sm"
            onClick={() => onOpen?.(row)}
        />
    },
    {
        name: 'Name',
        selector: 'name',
        type: 'string',
    },
    {
        name: 'Type',
        selector: 'type',
        type: 'node',
        renderRowNode: (row: any) =>
            <Stack>
                <Badge
                    variant="subtle"
                    width="fit-content"
            colorScheme={colorSchema[ row.type ] || 'yellow'}
                >
            {row.type}
                </Badge>
                <Badge
                    variant="subtle"
                    colorScheme="gray"
                    width="fit-content"
                >
                    {row.external ? 'opened' : 'local'}
                </Badge>
            </Stack>
    },
    {
        name: 'Address',
        selector: 'address',
        type: 'string',

    },
    {
        name: 'Date',
        selector: 'date',
        type: 'date',
    },
    {
        name: 'delete',
        selector: '',
        type: 'node',
        headerNode: <DeleteIcon color="black.500" boxSize={5} />,
        renderRowNode: (row: any) => <IconButton
            icon={<CloseIcon color="red.500" boxSize={4} />}
            aria-label="delete"
            size="sm"
            onClick={() => onDelete?.(row)}
        />
    }
    ];

    return columns;
}


type Props = {
    dbs: DBRow[];
}

export default function DataBaseList({ dbs = [] }: Props) {

    const navigate = useNavigate();
    const handleDelete = useCallback((row: DBRow) => {

    }, []);

    const handleOpen = useCallback((row: DBRow) => {

        let url = '';

        switch (row.type) {
            case 'feed':
                url = PATH.DB.FEED.replace(':id', row.multiHash).replace(':name', row.name);
                break;
            case 'eventlog':
                url = PATH.DB.EVENTLOG.replace(':id', row.multiHash).replace(':name', row.name);
                break;
            case 'keyvalue':
                url = PATH.DB.KEYVALUE.replace(':id', row.multiHash).replace(':name', row.name);
                break;
            case 'counter':
                url = PATH.DB.COUNTER.replace(':id', row.multiHash).replace(':name', row.name);
                break;
            case 'docstore':
            case 'docs':
                url = PATH.DB.DOCSTORE.replace(':id', row.multiHash).replace(':name', row.name);
                break;
        };
        if (!url)
            return;

        navigate(url);
    }, [ navigate ]);    

    const columns = useMemo(() => getColumns({ onDelete: handleDelete, onOpen: handleOpen }), [ handleDelete, handleOpen ]);

    return (
        <DataTable
            keyField="multiHash"
            rows={dbs}
            columns={columns}
            caption={{ show: false }}
        />
    );
}