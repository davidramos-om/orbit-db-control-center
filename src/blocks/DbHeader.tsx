import { Stack } from "@chakra-ui/react";

import { useAppDb } from "src/context/dbs-reducer";
import DbGoBack from "src/components/DbGoBack";
import DbInformation from "./DbInformation";

type Props = {
    multiHash: string;
}

export default function DbHeaderCard({ multiHash }: Props) {
    const { findDb } = useAppDb();
    const db = findDb(multiHash);

    return (
        <Stack spacing={4}>
            <DbGoBack />
            <DbInformation
                db={{
                    address: db?.payload.value.address || '',
                    name: db?.payload.value.name || '',
                    entriesCount: 0,
                    permissions: [],
                    type: db?.payload.value.type || 'none'
                }}
            />
        </Stack >
    );
}