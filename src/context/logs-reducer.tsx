import { type ReactNode, createContext, useContext, useReducer } from 'react';

type DbLog = {
    id: number;
    type: 'created' | 'updated' | 'deleted' | 'synced' | 'pinned' | 'preview'
    text: string;
    done: boolean
};

type ReducerAction = {
    type: 'added' | 'changed' | 'deleted';
    log: DbLog;
}

type ContextStructure = {
    logs: DbLog[]
}

const InitialState: DbLog[] = [
    {
        id: 1,
        type: 'created',
        text: 'Connecting to 12D3KooWEWaPCZdZLg6PQ5V9y6VzT8ZVVUM3XtA7jyi9dF4ec4eV',
        done: false
    }
];


const AppLogContext = createContext<ContextStructure>({ logs: InitialState });
const AppLogDispatchContext = createContext<React.Dispatch<ReducerAction>>(() => { });

function logReducer(records: DbLog[], action: ReducerAction): DbLog[] {

    switch (action.type) {
        case 'added': {
            return [ ...records, action.log ];
        }
        case 'changed': {
            return records.map(t => {

                if (t.id === action.log.id) {
                    return action.log;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return records.filter(t => t.id !== action.log.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}


export function AppLogProvider({ children }: { children: ReactNode }) {

    const [ logs, dispatch ] = useReducer(logReducer, InitialState);

    return (
        <AppLogContext.Provider value={{
            logs
        }}>
            <AppLogDispatchContext.Provider value={dispatch}>
                {children}
            </AppLogDispatchContext.Provider>
        </AppLogContext.Provider>
    );
}

export function useAppLog() {
    return useContext(AppLogContext);
}

export function useAppLogDispatch() {
    return useContext(AppLogDispatchContext);
}