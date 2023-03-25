import { Accordion, AccordionItem, AccordionButton, Box, AccordionIcon, AccordionPanel, useColorModeValue, HStack, Text } from '@chakra-ui/react'

import { TreeDotsHorizontalSvgIcon } from "src/components/TreeDotsHorizontalSvgIcon";
import { useAppLog } from "src/context/logs-reducer";


type Colors = {
    [ key: string ]: string
}

export const Colors: Colors = {
    'created': 'green',
    'updated': 'blue',
    'deleted': 'red',
    'synced': 'purple',
    'pinned': 'orange',
    'preview': 'gray',
    'none': 'yellow'
}


export default function AppLogs() {

    const { logs } = useAppLog();
    const bg = useColorModeValue('gray.300', 'blackAlpha.900');
    const itemsBg = useColorModeValue('gray.100', 'gray.900');
    const titleColor = useColorModeValue('gray.900', 'gray.100');

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
                        <Box key={log.id}>
                            <Text
                                as="b"
                                colorScheme={Colors[ log.type ]}
                            >
                                {log.type}
                            </Text>
                            <Text>
                                {log.text}
                            </Text>
                            <Text>
                                {log.text}
                            </Text>
                        </Box>

                    ))}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}