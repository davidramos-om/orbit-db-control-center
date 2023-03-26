import { TableVirtuoso } from "react-virtuoso";

export type EventLogModel = {
    id: string;
    date: Date;
    value: string;
}

type Props = {
    entries: EventLogModel[];
}

export default function EventLogs({ entries }: Props) {

    return (
        <TableVirtuoso
            style={{ height: 400 }}
            data={entries}
            overscan={200}
            fixedHeaderContent={() => (
                <tr>
                    <th style={{ width: 100, background: 'white', }}>#</th>
                    <th style={{ width: 220, background: 'white' }}>Id</th>
                    <th style={{ width: 220, background: 'white' }}>Date</th>
                    <th style={{ width: 'calc(100% - 320px)', background: 'white' }}>Value</th>
                </tr>
            )}
            itemContent={(index, log: EventLogModel) => (
                <>
                    <td style={{ width: 100, textAlign: 'center' }}>{index}</td>
                    <td style={{ width: 220 }}>{log.id}</td>
                    <td style={{ width: 220 }}>{log.date.toLocaleString()}</td>
                    <td style={{ width: 'calc(100% - 320px)' }}>{log.value}</td>
                </>
            )}
        />
    );
}


