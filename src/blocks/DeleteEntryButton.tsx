import { useCallback } from "react";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { confirmAlert } from "src/utils/SweetAlert2";

type Props = {
    identifier: string;
    dbAddress: string;
    onDelete: (id: string) => void;
}

export default function DeleteEntryButton({ identifier, dbAddress, onDelete }: Props) {

    const handleDelete = useCallback(async () => {

        const promp = await confirmAlert(({
            title: 'Confirm',
            text: 'Are you sure you want to delete this entry?',
            icon: 'question',
            cancelLabel: 'No',
            confirmLabel: 'Yes, delete it'
        }));

        if (!promp.isConfirmed)
            return;

        onDelete(identifier);

    }, [ identifier, onDelete ]);

    return (
        <IconButton
            aria-label='delete entry'
            icon={<DeleteIcon />}
            onClick={handleDelete}
        />
    );
}
