import { useParams } from 'react-router-dom';
import { Stack } from "@chakra-ui/react";

import DbHeaderCard from "src/blocks/DbHeader";

export default function DocumentDbPage() {

    const { id } = useParams();

    return (
        <Stack spacing={4}>
            <DbHeaderCard multiHash={id} />
        </Stack >
    );
}