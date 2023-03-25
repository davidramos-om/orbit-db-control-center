import { Box, Divider, Stack, Text } from '@chakra-ui/react';

import CreateDataBase from "src/blocks/CreateDB";
import RegreshDataBases from "src/blocks/RefreshDBs";
import OpenDataBase from "src/blocks/OpenDB";

import DataBaseList, { DBRow } from "src/blocks/DbList";
import { MapOrbitDbEntry } from "src/lib/mapper";
import { useAppDb } from "src/context/dbs-reducer";

const HomePage = () => {

    const { dbs } = useAppDb();

    const rows = dbs.map((db) => {

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
        <Box id="home-page" >
            <Stack
                spacing={4}
            >
                <Text as="b">DATABASES:</Text>
                <Stack direction={[ 'column', 'row' ]}>
                    <CreateDataBase />
                    <RegreshDataBases />
                    <OpenDataBase onDbOpened={() => { }} />
                </Stack>
                <Stack>
                    <DataBaseList dbs={rows} />
                </Stack>
            </Stack>
        </Box>
    );
}

export default HomePage;