import { Button } from "@chakra-ui/react"

import { ShowLoading, StopLoading } from "src/utils/SweetAlert2";
import { getAllDatabases } from "src/lib/db"
import { MapOrbitDbEntry } from "src/lib/mapper";
import { useAppDbDispatch } from "src/context/dbs-reducer";
import { useAppLogDispatch } from "src/context/logs-reducer";

export default function RegreshDataBases() {

    const dispatch = useAppDbDispatch();
    const logDispatch = useAppLogDispatch();

    const handleRegresh = async () => {
        try {

            ShowLoading({ title: 'Refreshing DataBases' });
            const entries = await getAllDatabases();
            const dbs = entries.map((db: any) => { return MapOrbitDbEntry(db) });

            dispatch({
                type: 'init',
                dbs,
            });

            logDispatch({
                type: 'add',
                log: {
                    text: `Refreshed DataBases`,
                    type: 'synced'
                }
            });

            StopLoading();
        }
        catch (error: any) {
            StopLoading();
            logDispatch({
                type: 'add',
                log: {
                    text: `Failed to refresh DataBases : ${error?.message || 'Something went wrong'}`,
                    type: 'error'
                }
            });

        }
    }

    return (
        <Button
            variant={"outline"}
            colorScheme='pink'
            onClick={handleRegresh}
        >
            Refresh DataBases
        </Button>
    );
}

