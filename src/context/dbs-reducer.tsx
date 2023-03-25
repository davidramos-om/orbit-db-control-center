import { type ReactNode, createContext, useContext, useReducer } from 'react';
import { DBEntry } from 'src/lib/types';

type ReducerAction = {
    type: 'added' | 'changed' | 'deleted' | 'init';
    dbs?: DBEntry[],
    db?: DBEntry;
}

type ContextStructure = {
    dbs: DBEntry[],
    findDb: (hash: string) => DBEntry | undefined;
}

const InitialState: DBEntry[] = [];


const AppDbContext = createContext<ContextStructure>({ dbs: InitialState, findDb: () => undefined });
const AppDbDispatchContext = createContext<React.Dispatch<ReducerAction>>(() => { });

function logsReducer(dbs: DBEntry[], action: ReducerAction): DBEntry[] {

    switch (action.type) {
        case 'init': {

            if ((action.dbs?.length || 0) <= 0)
                return [];

            return [ ...action.dbs! ];
        }
        case 'added': {
            if (!action.db)
                return dbs;

            return [ ...dbs, action.db ];
        }
        case 'changed': {

            if (!action.db)
                return dbs;

            return dbs.map(t => {

                if (t.id === action.db!.id) {
                    return action.db!;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {

            if (action.db)
                return dbs.filter(t => t.id !== action.db!.id);

            return dbs;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}


export function AppDbProvider({ children }: { children: ReactNode }) {

    const [ dbs, dispatch ] = useReducer(logsReducer, InitialState);


    const findDb = (hash: string) => {

        if (!hash)
            return undefined;

        return dbs.find((db) => db.hash === hash);
    }

    return (
        <AppDbContext.Provider value={{
            dbs,
            findDb
        }}>
            <AppDbDispatchContext.Provider value={dispatch}>
                {children}
            </AppDbDispatchContext.Provider>
        </AppDbContext.Provider>
    );
}

export function useAppDb() {
    return useContext(AppDbContext);
}

export function useAppDbDispatch() {
    return useContext(AppDbDispatchContext);
}