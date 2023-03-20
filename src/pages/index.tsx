import { useEffect, useState } from 'react'
import { Box, Divider, Spacer, Stack, Text } from '@chakra-ui/react';

import useIsMounted from 'src/hooks/useIsMounted';
import CreateDbDialog from "src/blocks/CreateDB";
import RegreshDataBases from "src/blocks/RefreshDBs";
import OpenDbDialog from "src/blocks/OpenDB";
import DataBaseList, { DBRow } from "src/blocks/DbList";
import { getAllDatabases } from "src/lib/db";
import { MapOrbitDbEntry } from "src/lib/mapper";

const HomePage = () => {

    const [ dbs, setDbs ] = useState<LogEntry<any>[]>([]);
    const isMounted = useIsMounted();

    useEffect(() => {
        getDbs();
    }, []);


    const getDbs = async () => {

        const _dbs = await getAllDatabases();
        if (isMounted())
            setDbs(_dbs);
    }

    const _rows = dbs.map((db) => {

        const entry = MapOrbitDbEntry(db);

        const _r: DBRow = {
            id: entry.id,
            multiHash: entry.hash,
            name: entry.payload.value.name,
            address: entry.payload.value.address,
            date: new Date(entry.payload.value.added),
            type: entry.payload.value.type
        }

        return _r;

    });

    return (
        <Box
            id="home-page"
        >
            <Text as="b">DATABASES:</Text>
            <Stack direction={[ 'column', 'row' ]}>
                <CreateDbDialog onDbCreated={getDbs} />
                <RegreshDataBases onProgramsLoaded={setDbs} />
                <OpenDbDialog onDbOpened={getDbs} />                
            </Stack>
            <br />
            <Divider color="white" borderColor={"gray.500"} />
            <br />
            <Stack>
                <DataBaseList dbs={_rows} />
            </Stack>

        </Box>
    );
}

export default HomePage;