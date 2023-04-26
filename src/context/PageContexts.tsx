import { createContext, useContext } from "react";

type ContextStructure = {
    onWrite?: (data: any) => void;
    onReplicated?: (address: any) => void;
}

const initialState: ContextStructure = {
    onWrite: () => { },
    onReplicated: () => { }
}


const AppDbContext = createContext<ContextStructure>({ ...initialState });

export function useDatabasePageContext() {
    return useContext(AppDbContext);
}

export function DatabasePageProvider({ children, onWrite, onReplicated }: {
    children: React.ReactNode,
    onWrite?: (data: any) => void;
    onReplicated?: (address: any) => void;
}) {

    return (
        <AppDbContext.Provider value={{
            onWrite,
            onReplicated
        }}>
            {children}
        </AppDbContext.Provider>
    );
}
