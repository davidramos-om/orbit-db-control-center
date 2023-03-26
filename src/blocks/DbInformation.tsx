import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardHeader, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";

import { DBEntry, DBType } from "src/lib/types";
import { Colors } from './DbList'


type DbDetails = {
    address: string;
    name: string;
    type: DBType | 'none';
    permissions: Record<string, string>[];
    entriesCount: number;
}

type Props = {
    showEntriesCount?: boolean;
    db?: DbDetails
}

export default function DbInformation({ db, showEntriesCount = true }: Props) {

    return (
        <Card variant={"elevated"}>
            <CardHeader>
                <Heading size='md'>{db?.address || '...'}</Heading>
            </CardHeader>
            <CardBody>
                <Stack spacing='1'>
                    <Text py='0.5'>
                        Name : <b>{db?.name || '...'}</b>
                    </Text>
                    <Text py='0.5'>
                        Type : <Badge
                            variant="subtle"
                            colorScheme={Colors[ db?.type || 'none' ] || 'yellow'}
                        >
                            {db?.type || 'none'}
                        </Badge>
                    </Text>
                    {showEntriesCount && (
                    <Text py='0.5'>
                        Entries : <b> {db?.entriesCount || '0'}</b>
                        </Text>
                    )}
                </Stack>
            </CardBody>
        </Card>
    );
}