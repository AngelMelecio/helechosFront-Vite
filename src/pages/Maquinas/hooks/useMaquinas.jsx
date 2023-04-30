import React from "react";

const MaquinasContext = React.createContext('MaquinasContext')

export function useMaquinas(){
    return useContext(MaquinasContext)
}

export function MaquinasProvider({children}){
    
    
    
    return(
        <MaquinasContext.Provider
            value={{

            }}
        >
            {children}
        </MaquinasContext.Provider>
    )
}