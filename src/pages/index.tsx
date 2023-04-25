import { Box, Stack, Text } from '@chakra-ui/react';

import CreateDataBase from "#/blocks/CreateDB";
import RegreshDataBases from "#/blocks/RefreshDBs";
import OpenDataBase from "#/blocks/OpenDB";
import DataBaseList, { DBRow } from "#/blocks/DbList";
import { useAppDb } from "#/context/dbs-reducer";
import { getOrbitDB } from '#/lib/db'

const HomePage = () => {

    const { dbs } = useAppDb();
    const dbInstance = getOrbitDB();

    const rows = dbs.map((db) => {

        // const entry = MapOrbitDbEntry(db);

        const _r: DBRow = {
            id: db.id,
            multiHash: db.hash,
            name: db.payload.value.name,
            address: db.payload.value.address,
            date: new Date(db.payload.value.added || 0),
            type: db.payload.value.type,
            external: db.identity.id !== (dbInstance ? String((dbInstance as any).identity?.id) : '')
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