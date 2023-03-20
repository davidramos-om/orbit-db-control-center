import { Icon, IconButton } from '@chakra-ui/react';
import { ViewIcon, DeleteIcon, CloseIcon, SettingsIcon } from '@chakra-ui/icons'

import DataTable, { DataColumn } from "src/components/Table";
import { programs, orbitdb } from 'src/lib/db';
import { useCallback, useMemo } from "react";
import OrbitDB from "orbit-db";

type Props = {
    dbs: LogEntry<any>[];
}


type getColumnsArgs = {
    onDelete?: (row: any) => void;
    onOpen?: (row: any) => void;
}

const getColumns = ({ onDelete, onOpen }: getColumnsArgs): DataColumn[] => {


    const columns: DataColumn[] = [ {
        name: 'settings',
        selector: '',
        type: 'node',
        headerNode: <ViewIcon boxSize={5} />,
        renderRowNode: (row: any) => <IconButton icon={<SettingsIcon color="black.500" boxSize={5} />} aria-label="settings" size="sm" onClick={() => onOpen?.(row)} />
    },
    {
        name: 'name',
        selector: 'name',
        type: 'string',
    },
    {
        name: 'type',
        selector: 'type',
        type: 'string',

    },
    {
        name: 'address',
        selector: 'address',
        type: 'string',
    },
    {
        name: 'date',
        selector: 'date',
        type: 'string',
    },
    {
        name: 'delete',
        selector: '',
        type: 'node',
        headerNode: <DeleteIcon color="black.500" boxSize={5} />,
        renderRowNode: (row: any) => <IconButton icon={<CloseIcon color="red.500" boxSize={4} />} aria-label="delete" size="sm" onClick={() => onDelete?.(row)} />
    }
    ];

    return columns;
}

export default function DataBaseList({ dbs = [] }: Props) {
    console.log(`🐛  -> 🔥 :  DataBaseList 🔥 :  dbs:`, { dbs, programs });


    const dbInstance = (orbitdb as OrbitDB);
    console.log(`🐛  -> 🔥 :  DataBaseList 🔥 :  dbInstance:`, dbInstance);





    const query = '';
    let _programs = programs;
    console.log(`🐛  -> 🔥 :  DataBaseList 🔥 :  _programs:`, _programs);


    const _rows = dbs.map((db, index) => {

        const _clock = db.clock;
        const ts = new Date(_clock.time * 1000);

        return {
            id: db.hash,
            name: db.hash,
            type: '',
            address: db.id,
            date: new Date(ts).toLocaleString(),
        }

    });

    const handleDelete = useCallback((row: any) => {


    }, []);

    const handleOpen = useCallback((row: any) => { }, []);


    const columns = useMemo(() => getColumns({ onDelete: handleDelete, onOpen: handleOpen }), [ handleDelete, handleOpen ]);

    return (
        <DataTable
            rows={_rows}
            columns={columns}
            caption={{ show: false }}
        />
    );
}