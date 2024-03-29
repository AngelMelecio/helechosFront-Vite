import React, { useState } from 'react'
import { useEffect } from 'react'
import { useFichas } from './useFichas'

const DetailModelos = React.createContext()

export function useDetailModelos() {
    return React.useContext(DetailModelos)
}

export function DetailModelosProvider({ children }) {

    const [saving, setSaving] = useState(false)
    const [theresChangesModelo, setTheresChangesModelo] = useState(false)
    const [theresChangesFicha, setTheresChangesFicha] = useState(false)
    const [theresChangesMateriales, setTheresChangesMateriales] = useState(false)
    const [selectedFichaIndx, setSelectedFichaIndx] = useState(null)
    const [disablePrint, setDisablePrint] = useState(true)
    const [pageScrollBottom, setPageScrollBottom] = useState(false)

    const {allFichasModelo} = useFichas()

    useEffect(() => {
        if( selectedFichaIndx === null ){
            setDisablePrint(true)
            return
        }
        if (theresChangesFicha) {
            setDisablePrint(true)
            return
        }
        if( selectedFichaIndx >= allFichasModelo.length ){
            setDisablePrint(true)
            return
        }
        setDisablePrint(false)

    }, [selectedFichaIndx, theresChangesFicha])

    return (
        <DetailModelos.Provider
            value={{
                saving, setSaving,
                theresChangesModelo, setTheresChangesModelo,
                theresChangesFicha, setTheresChangesFicha,
                selectedFichaIndx, setSelectedFichaIndx,
                theresChangesMateriales, setTheresChangesMateriales,
                disablePrint,
                pageScrollBottom, setPageScrollBottom

            }}
        >
            {children}
        </DetailModelos.Provider>)
}