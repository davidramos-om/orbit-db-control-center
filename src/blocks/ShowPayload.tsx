import { useRef } from "react";
import { ViewIcon } from '@chakra-ui/icons';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Code, IconButton, useDisclosure } from "@chakra-ui/react";

type Props = {
    payload: any;
}

export default function ShowEntryPayload({ payload }: Props) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    return (
        <>
            <IconButton
                aria-label='show payload'
                icon={<ViewIcon />}
                onClick={onOpen}
            />

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef as any}
                onClose={onClose}
                size='6xl'
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Entry
                        </AlertDialogHeader>

                        <AlertDialogBody
                            overflow='scroll'
                        >
                            <Code
                                width="100%"
                            >
                                <pre
                                    style={{
                                        overflow: "scroll",

                                    }}
                                >
                                    {JSON.stringify(payload || {}, null, 2)}
                                </pre>
                            </Code>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={onClose}>
                                Dismiss
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}