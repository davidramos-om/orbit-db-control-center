import { useParams } from 'react-router-dom';
import { Stack } from "@chakra-ui/react";

import DbHeaderCard from "src/blocks/DbHeader";

export default function KeyValueDbPage() {

    const { id } = useParams();

    return (
        <Stack spacing={4}>
            <DbHeaderCard
                multiHash={id || ''}
                entriesCount={0}
                showEntriesCount={true}
            />
        </Stack >
    );
}