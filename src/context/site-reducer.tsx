import { type ReactNode, createContext, useContext, useReducer } from 'react';

type ReducerAction = {
    type: 'setIpfsReady' | 'setOrbitDbReady';
    value: any;
}

type ContextStructure = {
    ipfsReady: boolean;
    orbitDbReady: boolean;
}

const initialState: ContextStructure = {
    ipfsReady: false,
    orbitDbReady: false
}


const AppDbContext = createContext<ContextStructure>({ ...initialState });

const AppDbDispatchContext = createContext<React.Dispatch<ReducerAction>>(() => { });

function appStateReducer(state: ContextStructure, action: ReducerAction): ContextStructure {

    switch (action.type) {
        case 'setOrbitDbReady': {


            return {
                ...state,
                orbitDbReady: Boolean(action.value)
            }
        }
        case 'setIpfsReady': {
            return {
                ...state,
                ipfsReady: Boolean(action.value)
            };
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}


export function AppSiteStateProvider({ children }: { children: ReactNode }) {

    const [ state, dispatch ] = useReducer(appStateReducer, initialState);

    return (
        <AppDbContext.Provider value={state}>
            <AppDbDispatchContext.Provider value={dispatch}>
                {children}
            </AppDbDispatchContext.Provider>
        </AppDbContext.Provider>
    );
}

export function useSiteState() {
    return useContext(AppDbContext);
}

export function useSiteStateDispatch() {
    return useContext(AppDbDispatchContext);
}