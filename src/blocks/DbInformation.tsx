import { useState } from "react";
import { Badge, Card, CardBody, CardHeader, HStack, Heading, Icon, IconButton, Stack, Text, Tooltip } from "@chakra-ui/react";
import { CopyIcon, CheckIcon, } from "@chakra-ui/icons";

import SvgIconify from 'src/components/SvgIconify'
import { pinData } from "#/lib/manage-dbs";
import { colorSchema } from './DbList'
import { DbInformationGrantAccess, DbDetails } from './DbInformationGrantAccess';


type Props = {
    showEntriesCount?: boolean;
    db?: DbDetails
}

export default function DbInformation({ db, showEntriesCount = true }: Props) {

    const [ copied, setCopied ] = useState<boolean>(false);
    const [ bafyCid, setBafyCid ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);

    const handleSyncPeersLocally = async () => {

        try {
            if (!db?.address)
                return;

            if (loading)
                return;

            setLoading(true);
            const cid = await pinData(db?.address || '');
            setBafyCid(cid.toString());
        }
        catch (error) {
            console.log("pinData.error", error);
        }
        finally {
            setLoading(false);
        }
    }

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
                        <>
                        <Icon onClick={handleCopyToClipboard}
                            cursor='pointer'
                            color={copied ? 'green.500' : 'gray.500'}
                            ml='auto'
                            as={copied ? CheckIcon : CopyIcon}
                        />
                        <Tooltip
                            label="Sync with local peers"
                        >
                            <IconButton
                                variant="ghost"
                                onClick={handleSyncPeersLocally}
                                aria-label="sync database with local peers"
                                cursor='pointer'
                                ml='auto'
                                icon={<SvgIconify icon='academicons:pubpeer-square' />}
                            />
                        </Tooltip>
                    </>
                    }
                </HStack>
                {bafyCid && <Text> {bafyCid} </Text>}
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
                <DbInformationGrantAccess
                    db={db}
                />
            </CardBody>
        </Card>
    );
}