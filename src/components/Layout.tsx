import { Avatar, Box, Button, Divider, Flex, Heading, HStack, Link, Spacer, Text, useColorModeValue } from "@chakra-ui/react";
import { Link as Reactink } from 'react-router-dom'

import ColorModeToggle from 'src/components/ThemeMode';
import { Systems } from "./Systems";

type Props = {
    children: React.ReactNode
}

const HeaderLayout = ({ children }: Props) => {

    const bg = useColorModeValue('gray.100', 'gray.900');
    return (
        <Flex
            direction={'column'}
            w={'full'}
            h={'100vh'}
        >
            <Flex
                minWidth='max-content'
                alignItems='center'
                gap='2'
            >
                <Link
                    as={Reactink}
                    to='/'
                    textDecoration="none"
                >
                    <HStack p='2'>
                        <Avatar size="md" name="Control Center" src="./orbit-db.png" />
                        <Heading>
                            OrbitDB Control Center
                        </Heading>
                    </HStack>
                </Link>
                <Spacer />
                <ColorModeToggle />
                <Button colorScheme='teal'>Connect Wallet</Button>
            </Flex>
            <Divider />
            <Flex
                minWidth='max-content'
                alignItems='center'
                gap='2'
            >
                <HStack spacing={1} p={2}>
                    <Text as="b">System Status:</Text>
                    <Systems />
                </HStack>
            </Flex>
            <Divider />
            <Box
                bg={bg}
                p={4}
                height="full"
            >
                {children}
            </Box>
        </Flex>
    );
}

export default HeaderLayout;