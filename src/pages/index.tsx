import { useEffect } from "react";
import { Box, Stack, Text } from '@chakra-ui/react';

import { useSiteState, useSiteStateDispatch } from "#/context/SiteContext";
import CreateDataBase from "#/blocks/CreateDB";
import RegreshDataBases from "#/blocks/RefreshDBs";
import OpenDataBase from "#/blocks/OpenDB";
import DataBaseList, { DBRow } from "#/blocks/DbList";
import { useAppDb } from "#/context/DBsContext";

const HomePage = () => {

    const { dbs } = useAppDb();
    const { orbitDb } = useSiteState();
    const siteDispatcher = useSiteStateDispatch();

    useEffect(() => {

        siteDispatcher({
            type: 'setStore',
            value: null,
        });

    }, [ siteDispatcher ]);

    const rows = dbs.map((db) => {
        const _r: DBRow = {
            id: db.id,
            multiHash: db.hash,
            name: db.payload.value.name,
            address: db.payload.value.address,
            date: new Date(db.payload.value.added || 0),
            type: db.payload.value.type,
            external: db.identity.id !== (orbitDb ? String((orbitDb as any).identity?.id) : '')
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