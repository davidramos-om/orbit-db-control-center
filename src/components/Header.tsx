import { Avatar, Box, Button, Divider, Flex, Heading, HStack, Icon, Link, Spacer, Stack, Text } from "@chakra-ui/react";
import { Link as Reactink } from 'react-router-dom'
import { useState, useEffect } from 'react';

import { initIPFS, initOrbitDB } from 'src/database'
import { DBState } from "src/types/orbitdb";


type SystemProps = {
    label: string,
}

const System = ({ label }: SystemProps) => {

    const [ dbState, setDbState ] = useState<DBState>(DBState.connecting);

    useEffect(() => {

        let isMounted = true;

        const init = async () => {
            try {

                const ifps = await initIPFS();
                console.log(`🐛  -> 🔥 :  init 🔥 :  ifps:`, ifps);

                if (ifps) {
                    const db = await initOrbitDB(ifps);                    
                    console.log(`🐛  -> 🔥 :  init 🔥 :  db:`, db);
                    setDbState((db?.id) ? DBState.connected : DBState.disconnected);
                }
                else
                    setDbState(() => DBState.disconnected);
            }
            catch (error: any) {
                console.error("init.errors : ", { error });
                setDbState(() => DBState.error);
            }
        }

        setTimeout(() => {
            init();
        }, 3000);

        return () => {
            isMounted = false;
        }

    }, []);


    console.log(`🐛  -> 🔥 :  System 🔥 :  dbState:`, dbState);
    const color = dbState === DBState.connected ? 'green.500' : dbState === DBState.error ? 'red.500' : dbState === DBState.disconnected ? 'black.500' : 'orange.500';

    return (
        <>
            <Icon viewBox='0 0 200 200' color={color}>
                <path fill='currentColor' d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0' />
            </Icon>
            <Text> {label} </Text>
        </>
    );
}

type HeaderProps = {
    children: React.ReactNode
}

const Header = ({ children }: HeaderProps) => {

    return (
        <>
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
                <Button colorScheme='teal'>Connect Wallet</Button>
            </Flex>
            <Divider />
            <Flex
                minWidth='max-content'
                alignItems='center'
                gap='2'
            >
                <HStack spacing={1} p={2}>
                    <Text as="b">Implementations:</Text>
                    <System label='OrbitDB' />
                </HStack>
            </Flex>
            <Divider />
            <Flex>
                <Reactink to="/blog">
                    blog
                </Reactink> |
                <Reactink to="/about">
                    about
                </Reactink> |
                <Reactink to="/components">
                    components
                </Reactink> |
                <Reactink to="/xxx">
                    not exists
                </Reactink>
            </Flex>
            <Box
                bg={'gray.100'}
                p={4}
                height="full"
            >
                {children}
            </Box>
        </>
    );
}

export default Header;