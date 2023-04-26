import { type ReactNode, createContext, useContext, useReducer } from 'react';
import { IPFS } from "ipfs-core";
import OrbitDB from "orbit-db";
import Store from "orbit-db-store";

type ReducerAction = {
    type: 'setIpfsReady' | 'setOrbitDbReady' | 'setIpfs' | 'setOrbitDb' | 'setStore';
    value: boolean | IPFS | OrbitDB | Store | null;
}

type ContextStructure = {
    ipfsReady: boolean;
    orbitDbReady: boolean;
    ipfs: IPFS | null,
    orbitDb: OrbitDB | null,
    store: Store | null
}

const initialState: ContextStructure = {
    ipfsReady: false,
    orbitDbReady: false,
    ipfs: null,
    orbitDb: null,
    store: null
}


const AppDbContext = createContext<ContextStructure>({ ...initialState });
const AppDbDispatchContext = createContext<React.Dispatch<ReducerAction>>(() => { });

function appStateReducer(state: ContextStructure, action: ReducerAction): ContextStructure {


    if (action.type === 'setIpfsReady' && action.value && typeof action.value !== 'boolean')
        throw Error('setIpfsReady action value must be boolean');

    if (action.type === 'setOrbitDbReady' && action.value && typeof action.value !== 'boolean')
        throw Error('setOrbitDbReady action value must be boolean');

    if (action.type === 'setOrbitDb' && action.value && !(action.value instanceof OrbitDB))
        throw Error('setOrbitDb action value must be OrbitDB');

    // if (action.type === 'setIpfs' && !(action.value instanceof IPFS))
    //     throw Error('setIpfs action value must be IPFS');

    if (action.type === 'setStore' && action.value && !(action.value instanceof Store))
        throw Error('setStore action value must be Store');


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
        case 'setIpfs': {
            return {
                ...state,
                ipfs: action.value as IPFS,
                ipfsReady: action.value !== null
            };
        }
        case 'setOrbitDb': {
            return {
                ...state,
                orbitDb: action.value as OrbitDB,
                orbitDbReady: action.value !== null
            };
        }
        case 'setStore': {

            try {
                if (state.store) {
                    // console.log('closing store and removing listeners');
                    // state.store.events.removeAllListeners();
                    // state.store.close();
                }
            }
            catch (error) {
                console.error('error closing store', error);
            }

            return {
                ...state,
                store: action.value as Store
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