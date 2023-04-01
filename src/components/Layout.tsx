import { Avatar, Box, Divider, Flex, Heading, HStack, Link, Spacer, Text, useColorModeValue, chakra, IconButton } from "@chakra-ui/react";
import { Link as ReactLink } from 'react-router-dom'

import ColorModeToggle from 'src/components/ThemeMode';
import AppLogs from 'src/blocks/AppLogs';
import { Systems } from "./Systems";
import Iconify from "./SvgIconify";

type Props = {
    children: React.ReactNode
}

const HeaderLayout = ({ children }: Props) => {

    const bg = useColorModeValue('gray.50', 'gray.800');
    const bgChildren = useColorModeValue('gray.100', 'gray.700');

    return (
        <Flex
            direction={'column'}
            w={'full'}
            h={'100vh'}
        >
            <chakra.div
                bg={bg}
            >
                <Flex
                    minWidth='max-content'
                    alignItems='center'
                    gap='2'
                >
                    <Link
                        as={ReactLink}
                        to='/'
                        textDecoration="none"
                    >
                        <HStack p='2'>
                            <Avatar
                                size="md"
                                name="Orbit"
                                src="/orbit-db.png"
                            />
                            <Heading>
                                OrbitDB Control Center
                            </Heading>
                        </HStack>
                    </Link>
                    <Spacer />
                    <ColorModeToggle />
                    <IconButton
                        as={ReactLink}
                        target="_blank"
                        to="https://github.com/davidramos-om/orbit-db-control-center"
                        aria-label="GitHub repository"
                        icon={<Iconify icon="bi:github" />}
                    />
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
            </chakra.div>
            <Divider />
            <Box
                p={4}
                bg={bgChildren}
            >
                {children}
            </Box>
            <AppLogs />
        </Flex>
    );
}

export default HeaderLayout;