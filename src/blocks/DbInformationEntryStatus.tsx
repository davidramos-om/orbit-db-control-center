import { useEffect, useCallback, useState } from "react";
import { Text } from "@chakra-ui/react";

import { useSiteState } from "src/context/SiteContext";
import { useDatabasePageContext } from "src/context/PageContexts";
import { DateTimeFormat, ShortDateDividerHelper } from "#/utils/date-service";

export function DbInformationEntryStatus() {

    const { store } = useSiteState();
    const [ peers, setPeers ] = useState<{ time: Date, peers: string[] } | null>(null);
    const [ closed, setClosed ] = useState<boolean>(false);
    const [ replicating, setReplicating ] = useState<boolean>(false);
    const [ replicated, setReplicated ] = useState<{ time: Date, address: string }[]>([]);
    const [ exchanged, setExchanged ] = useState<{ time: Date, peers: string[] } | null>(null);
    const [ loadingProgress, setLoadingProgress ] = useState<number>(0);
    const [ lastWrite, setLastWrite ] = useState<Date | null>(null);
    const { onReplicated: emitReplicated, onWrite: emitWrite } = useDatabasePageContext();

    const onReplicate = useCallback((address: any) => {
        setReplicating(true);
    }, []);

    const onReady = useCallback((dbname: any, heads: any) => {
        setClosed(false);
    }, []);

    const onWrite = useCallback((address: any, entry: any, heads: any) => {
        setLastWrite(new Date());
        emitWrite?.(entry);
    }, [ emitWrite ]);

    const onReplicated = useCallback((address: any) => {

        console.log('replicated from : ', address);
        emitReplicated?.(address);
        setReplicating(false);
        setReplicated((prev) => {

            const index = prev.findIndex((r) => r.address === address);
            if (index > -1) {
                prev[ index ].time = new Date();
                return prev;
            }

            return [
                ...prev,
                {
                    time: new Date(),
                    address
                }
            ];
        });
    }, [ emitReplicated ]);

    const replicateProgress = useCallback((address: any, hash: any, entry: any, progress: any, have: any) => {
        setReplicating(true);
    }, []);

    const loadProgress = useCallback((address: any, hash: any, entry: any, progress: any, total: any) => {
        setLoadingProgress((prev) => Math.round((progress / total) * 100));
    }, []);

    const onPeer = useCallback(async (peerId: any) => {

        if (!peerId)
            return;

        setPeers((prev) => {


            if (prev && prev.peers.includes(peerId)) {
                prev.time = new Date();
                return prev;
            }

            return {
                time: new Date(),
                peers: [
                    ...prev?.peers || [],
                    peerId
                ]
            };
        })

    }, []);

    const peerExchanged = useCallback((peer: any, address: any, heads: any) => {

        // console.log('peerExchanged', new Date().getTime());
        if (!peer)
            return;

        const peerId = peer.toString();

        setExchanged((prev) => {


            if (prev && prev.peers.includes(peerId)) {
                prev.time = new Date();
                return prev;
            }

            return {
                time: new Date(),
                peers: [
                    ...prev?.peers || [],
                    peerId
                ]
            };
        });
    }, []);

    const onClose = useCallback((dbname: any) => {
        setClosed(true);
    }, []);


    useEffect(() => {

        if (!store)
            return;

        console.log('subscribing to store events');
        store.events.on('replicate', onReplicate);
        store.events.on('replicated', onReplicated);
        store.events.on('replicate.progress', replicateProgress);
        store.events.on('load.progress', loadProgress);
        store.events.on('peer', onPeer);
        store.events.on('peer.exchanged', peerExchanged);
        store.events.on('ready', onReady);
        store.events.on('write', onWrite);
        store.events.on('closed', onClose);

        return () => {
            console.log('unsubscribing from store events');
            store.events.off('replicate', onReplicate);
            store.events.off('replicated', onReplicated);
            store.events.off('replicate.progress', replicateProgress);
            store.events.off('load.progress', loadProgress);
            store.events.off('peer', onPeer);
            store.events.off('peer.exchanged', peerExchanged);
            store.events.off('ready', onReady);
            store.events.off('write', onWrite);
            store.events.off('closed', onClose);
        }


    }, [ store, onReplicate, onReady, onWrite, onReplicated, replicateProgress, loadProgress, onPeer, peerExchanged, onClose ]);


    return (
        <>
            <Text>Open: <b>{!closed ? 'true' : 'false'} | </b></Text>
            <Text>Replication Status:</Text>
            <Text>Running: <b>{replicating ? 'true' : 'false'}</b></Text>
            <Text>Queue: <b>{store?.replicationStatus?.queued || '0'}</b></Text>
            <Text>Processed: <b>{store?.replicationStatus?.progress || '--'}</b></Text>
            <Text>Max: <b>{store?.replicationStatus?.max || '--'}</b></Text>
            <Text>Buffered: <b>{store?.replicationStatus?.buffered || '0'} | </b></Text>

            <Text>Last write: <b>{lastWrite ? ShortDateDividerHelper(lastWrite) : 'never'} |</b></Text>

            <Text>Loading Progress :<b>{loadingProgress}% |</b></Text>
            <Text>Replicated :<b>{replicated.length} |</b></Text>
            <Text>Connected Peers: <b>{peers ? '1' : '0'} |</b></Text>
            <Text>Last Exchange: <b>{exchanged?.time ? DateTimeFormat(exchanged.time, 'H:m:s') + ' with : ' + exchanged.peers.length + ' peers' : 'never'}</b></Text>
        </>
    )
}