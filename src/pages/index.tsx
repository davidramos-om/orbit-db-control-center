import { FC, useEffect, useState } from 'react'
import { Box, Button, Stack, Text } from '@chakra-ui/react';

import CreateDbDialog from "../blocks/CreateDB";
import { getAllDatabases } from "../database";
import DataTable from "../components/Table";

const index: FC = () => {

    const [ dbs, setDbs ] = useState<any[]>([]);

    useEffect(() => {


        let isMounted = true;

        const getDbs = async () => {
            const _dbs = await getAllDatabases();
            console.log(`🐛  -> 🔥 :  getDbs 🔥 :  _dbs:`, _dbs);

            setDbs(_dbs);
        }

        getDbs();

        return () => {
            isMounted = false;
        }

    }, []);


    return (
        <Box>
            <Text as="b">DATABASES:</Text>
            <Stack
                direction={[ 'column', 'row' ]}
            >
                <CreateDbDialog />
                <Button
                    variant={"outline"}
                    colorScheme='teal'
                >
                    Open Database
                </Button>
            </Stack>
            <Stack>
                <DataTable title="Databases" rows={dbs} />
            </Stack>

        </Box>
    );
}

export default index