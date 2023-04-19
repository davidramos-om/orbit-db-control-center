import { useState } from "react";
import { Badge, Card, CardBody, CardHeader, HStack, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

import { DBType } from "#/lib/types";
import { colorSchema } from './DbList'


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

    const [ copied, setCopied ] = useState<boolean>(false);
    const handleCopyToClipboard = () => {

        if (!navigator.clipboard) {
            alert('Clipboard API not supported');
            return;
        }

        if (!db?.address) {
            alert('No address to copy');
            return;
        }

        navigator.clipboard.writeText(db.address);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <Card variant={"elevated"}>
            <CardHeader>
                <HStack spacing='1'>
                    <Heading size='md'>{db?.address || '...'}</Heading>
                    {db?.address &&
                        <Icon onClick={handleCopyToClipboard}
                            cursor='pointer'
                            color={copied ? 'green.500' : 'gray.500'}
                            ml='auto'
                            as={copied ? CheckIcon : CopyIcon}
                        />
                    }
                </HStack>
            </CardHeader>
            <CardBody>
                <Stack spacing='1'>
                    <Text py='0.5'>
                        Name : <b>{db?.name || '...'}</b>
                    </Text>
                    <Text py='0.5'>
                        Type : <Badge
                            variant="subtle"
                            colorScheme={colorSchema[ db?.type || 'none' ] || 'yellow'}
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