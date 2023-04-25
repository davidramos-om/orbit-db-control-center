import { OrbitDbProgram } from './types';
import { getOrbitDB, getProgram } from "./db";

export const getAllPrograms = async (): Promise<OrbitDbProgram[]> => {

    let program = getProgram();
    if (program) {
        return program.iterator({ limit: -1 }).collect() as OrbitDbProgram[];
    }

    return [];
};

export const getProgramByHash = (multiHash: string): OrbitDbProgram => {

    const orbitdb = getOrbitDB();
    const program = getProgram();

    if (program && orbitdb) {

        const db = program.iterator({ limit: -1 }).collect().find((db: any) => {
            return db.hash === multiHash;
        });

        return db as OrbitDbProgram;
    }

    return null;
};
