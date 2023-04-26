import { useState } from "react";
import { Badge, Card, CardBody, CardHeader, Heading, Icon, IconButton, Stack, Text, Tooltip } from "@chakra-ui/react";
import { CopyIcon, CheckIcon, } from "@chakra-ui/icons";

import { useSiteState } from '#/context/SiteContext';
import SvgIconify from '#/components/SvgIconify'
import { pinData } from "#/lib/manage-dbs";
import { colorSchema } from './DbList'
import { DbInformationEntryStatus } from './DbInformationEntryStatus';
import { DbInformationGrantAccess, DbDetails } from './DbInformationGrantAccess';


type Props = {
    showEntriesCount?: boolean;
    db?: DbDetails
}

export default function DbInformation({ db, showEntriesCount = true }: Props) {

    const [ copied, setCopied ] = useState<boolean>(false);
    const [ bafyCid, setBafyCid ] = useState<string>('');
    const [ loading, setLoading ] = useState<boolean>(false);
    const { store: orbitStore } = useSiteState()


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

    const handlePrintToConsole = () => {
        console.log({ orbitDbStore: orbitStore });
    }

    return (
        <Card variant={"elevated"}>
            <CardHeader>
                <Stack
                    spacing='1'
                    direction={{ base: 'column', md: 'row' }}
                    alignItems="center"
                >
                    <Heading
                        wordBreak={'break-all'}
                        size={{ base: 'sm', md: 'md' }}
                        maxInlineSize={{ base: '100%', md: '80%' }}
                    >{db?.address || '...'}
                    </Heading>
                    {db?.address &&
                        <Stack
                            direction='row'
                            alignItems="center"
                        >
                            <Tooltip label="Copy address to clipboard">
                                <Icon onClick={handleCopyToClipboard}
                                    cursor='pointer'
                                    color={copied ? 'green.500' : 'gray.500'}
                                    ml='auto'
                                    as={copied ? CheckIcon : CopyIcon}
                                />
                            </Tooltip>
                            <Tooltip
                                label="Print to console"
                            >
                                <IconButton
                                    variant="ghost"
                                    onClick={handlePrintToConsole}
                                    aria-label="print database to console"
                                    cursor='pointer'
                                    ml='auto'
                                    icon={<SvgIconify icon='mdi:console' />}
                                />
                            </Tooltip>
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
                        </Stack>
                    }
                </Stack>
                <Stack
                    spacing='1'
                    direction={{ base: 'column', md: 'row' }}
                    alignItems="flex-start"
                >
                    <DbInformationEntryStatus />
                </Stack>
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