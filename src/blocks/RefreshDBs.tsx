import { Button } from "@chakra-ui/react"

import { getAllDatabases } from "src/lib/db"
import { ShowLoading, StopLoading } from "../utils/SweetAlert2";

type Props = {
    onProgramsLoaded: (programs: LogEntry<any>[]) => void;
}

export default function RegreshDataBases({ onProgramsLoaded }: Props) {

    const handleRegresh = async () => {
        try {
            ShowLoading({ title: 'Refreshing DataBases' });
            const dbs = await getAllDatabases();
            onProgramsLoaded(dbs);
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

