import type { FC } from 'react'
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom'
import CreateDbDialog from "../blocks/CreateDB";

const index: FC = () => {
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
        </Box>
    );
}

export default index