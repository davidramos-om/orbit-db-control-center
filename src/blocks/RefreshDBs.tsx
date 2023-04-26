import { Button } from "@chakra-ui/react"

import { ShowLoading, StopLoading } from "#/utils/SweetAlert2";
import { getAllPrograms } from "#/lib/manage-programs";
import { MapOrbitDbEntry } from "#/lib/mapper";
import { useAppDbDispatch } from "#/context/DBsContext";
import { useAppLogDispatch } from "#/context/LogsContext";
import { useSiteState } from "#/context/SiteContext";

export default function RegreshDataBases() {

    const dispatch = useAppDbDispatch();
    const logDispatch = useAppLogDispatch();
    const { orbitDbReady } = useSiteState();

    const handleRegresh = async () => {
        try {

            ShowLoading({ title: 'Refreshing DataBases' });
            await new Promise(resolve => setTimeout(resolve, 500));

            const programs = await getAllPrograms();
            const dbs = programs.map((p: any) => { return MapOrbitDbEntry(p) });

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
            isDisabled={!orbitDbReady}
        >
            Refresh DataBases
        </Button>
    );
}

