import { Accordion, AccordionItem, AccordionButton, Box, AccordionIcon, AccordionPanel, useColorModeValue, HStack, Text } from '@chakra-ui/react'
import { TreeDotsHorizontalSvgIcon } from "src/components/TreeDotsHorizontalSvgIcon";

export default function AppLogs() {

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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}