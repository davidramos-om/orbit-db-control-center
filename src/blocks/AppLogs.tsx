import { Accordion, AccordionItem, AccordionButton, Box, Flex, AccordionIcon, AccordionPanel, useColorModeValue, HStack, Text } from '@chakra-ui/react'

import { TreeDotsHorizontalSvgIcon } from "src/components/TreeDotsHorizontalSvgIcon";
import { useAppLog } from "src/context/logs-reducer";
import { sentenseCase } from "src/utils/helper";


type Colors = {
    [ key: string ]: string
}

const exludeTypes = [ 'error', 'none', 'preview', 'synced', 'pinned', 'connected', 'disconnected', 'connecting' ];
export const Colors: Colors = {
    'created': 'green',
    'updated': 'blue',
    'deleted': 'red',
    'synced': 'purple',
    'pinned': 'orange',
    'preview': 'gray',
    'error': 'red',
    'connected': 'green',
    'disconnected': 'red',
    'connecting': 'yellow',
    'none': 'yellow'
}

export default function AppLogs() {

    const { logs } = useAppLog();
    const bg = useColorModeValue('gray.300', 'blackAlpha.900');
    const itemsBg = useColorModeValue('gray.800', 'gray.900');
    const titleColor = useColorModeValue('gray.400', 'gray.100');

    return (
        <Accordion
            allowToggle
            bg={bg}
        >
            <AccordionItem
                color={titleColor}
            >
                <h2>
                    <AccordionButton>
                        <Box flex="1" textAlign="left">
                            <HStack>
                                <TreeDotsHorizontalSvgIcon />
                                <Text as="b">
                                    Output
                                </Text>
                            </HStack>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel
                    pb={4}
                    bg={itemsBg}
                >
                    {logs.map((log) => (
                        <Flex key={log.id}>
                            <Text
                                as="b"
                                color={Colors[ log.type ]}
                            >
                                {`${sentenseCase(log.type)}`}
                            </Text>
                            <Text>
                                {` : ${log.text} `}
                            </Text>
                            {exludeTypes.includes(log.type) ? null : (
                                <Text
                                    as="b"
                                    color={Colors[ log.type ]}
                                    pl={1}
                                >
                                    {`- hash : ${log.id}`}
                                </Text>
                            )}
                        </Flex>

                    ))}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}