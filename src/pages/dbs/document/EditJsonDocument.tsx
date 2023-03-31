
import { ReactElement, cloneElement, useEffect, useState, useRef } from "react";
import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
    ModalCloseButton, Text, Textarea, useDisclosure
} from "@chakra-ui/react"

import { isValidJson, prettyJson } from "src/utils/helper";
import { confirmAlert } from "~/src/utils/SweetAlert2";

type Props = {
    json: string
    onAccept: (document: string) => void;
    children: ReactElement;
}

export default function EditJsonDocument({ json, children, onAccept }: Props) {

    const cancelRef = useRef();
    const [ document, setDocument ] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ error, setError ] = useState('');

    useEffect(() => {

        const isValid = isValidJson(json);
        const jsonFormatted = isValid ? prettyJson(json) : json;

        setDocument(() => jsonFormatted);
        setError(() => isValid ? '' : 'Invalid JSON');

    }, [ json, setDocument, setError ]);

    const handleCreate = () => {

        if (!document)
            return;

        if (!isValidJson(document)) {
            setError('Invalid JSON');
            return;
        }

        onAccept(document);
        onClose();
    }

    const handleClose = async () => {

        const prompt = await confirmAlert({
            title: 'Discard changes?',
            text: 'Are you sure you want to discard changes?',
            icon: 'question',
            cancelLabel: 'No',
            confirmLabel: 'Yes'
        });

        if (!prompt.isConfirmed)
            return;

        onClose();
    }

    return (
        <>
            {cloneElement(children, { onClick: onOpen })}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef as any}
                onClose={handleClose}
                size="2xl"

            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Edit JSON Document
                        </AlertDialogHeader>
                        <ModalCloseButton />
                        <AlertDialogBody>
                            <Textarea
                                minW="full"
                                w="max-content"
                                h="xl"
                                placeholder="{...}"
                                colorScheme={"gray"}
                                value={document}
                                overflowY="auto"
                                onChange={(e) => setDocument(e.target.value)}
                            />
                            {error && <Text color="red.500">{error}</Text>}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef as any} onClick={handleClose}>
                                Discard
                            </Button>
                            <Button
                                colorScheme='pink'
                                onClick={handleCreate}
                                ml={3}
                            >
                                Save
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

