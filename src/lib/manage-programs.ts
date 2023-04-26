import { getOrbitDB, getProgram } from "./db";

export const getAllPrograms = async (): Promise<LogEntry<unknown>[]> => {

    let program = getProgram();
    if (program) {
        await program.load();
        const all = program.iterator({ limit: -1 }).collect();
        return all;
    }

    return [];
};

export const getProgramByHash = (multiHash: string): LogEntry<unknown> | null => {

    const orbitdb = getOrbitDB();
    const program = getProgram();

    if (program && orbitdb) {

        const db = program.iterator({ limit: -1 }).collect().find((db: any) => {
            return db.hash === multiHash;
        });

        if (db)
            return db;
    }

    return null;
};
