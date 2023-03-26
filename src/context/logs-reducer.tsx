import { type ReactNode, createContext, useContext, useReducer } from 'react';
import { v4Id } from "src/utils/helper";

type DbLog = {
    id?: string;
    type: 'created' | 'updated' | 'deleted' | 'synced' | 'pinned' | 'preview' | 'error' | 'connected' | 'disconnected' | 'connecting'
    text: string;
    date?: Date;
};

type ReducerAction = {
    type: 'add' | 'clear'
    log: DbLog;
}

type ContextStructure = {
    logs: DbLog[]
}

const InitialState: DbLog[] = [];


const AppLogContext = createContext<ContextStructure>({ logs: InitialState });
const AppLogDispatchContext = createContext<React.Dispatch<ReducerAction>>(() => { });

function logReducer(records: DbLog[], action: ReducerAction): DbLog[] {


    switch (action.type) {
        case 'clear':
            return [];
        case 'add': {
            return [ ...records,
            {
                ...action.log,
                date: action.log.date || new Date(),
                id: action.log.id || v4Id()
            }
            ];
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