import { Button } from "@chakra-ui/react"

import { ShowLoading, StopLoading } from "src/utils/SweetAlert2";
import { getAllDatabases } from "src/lib/db"
import { MapOrbitDbEntry } from "src/lib/mapper";
import { useAppDbDispatch } from "src/context/dbs-reducer";

export default function RegreshDataBases() {

    const dispatch = useAppDbDispatch();

    const handleRegresh = async () => {
        try {
            ShowLoading({ title: 'Refreshing DataBases' });
            const entries = await getAllDatabases();
            const dbs = entries.map((db: any) => { return MapOrbitDbEntry(db) });

            dispatch({
                type: 'init',
                dbs,
            });

            StopLoading();
        }
        catch (error) {
            StopLoading();
        }
    }

    return (
        <Button
            variant={"outline"}
            colorScheme='green'
            onClick={handleRegresh}
        >
            Refresh DataBases
        </Button>
    );
}

