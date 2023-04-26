import { Stack } from "@chakra-ui/react";

import { useAppDb } from "#/context/DBsContext";
import DbGoBack from "#/components/DbGoBack";
import DbInformation from "./DbInformation";

type Props = {
    multiHash: string;
    entriesCount: number;
    showEntriesCount?: boolean;
}

export default function DbHeaderCard({ multiHash, entriesCount, showEntriesCount }: Props) {
    const { findDb } = useAppDb();
    const db = findDb(multiHash);

    return (
        <Stack spacing={4}>
            <DbGoBack />
            <DbInformation
                showEntriesCount={showEntriesCount}
                db={{
                    address: db?.payload.value.address || '',
                    name: db?.payload.value.name || '',
                    entriesCount: entriesCount || 0,
                    permissions: [],
                    type: db?.payload.value.type || 'none'
                }}
            />
        </Stack >
    );
}