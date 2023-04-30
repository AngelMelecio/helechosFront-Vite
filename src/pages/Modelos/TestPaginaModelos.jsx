import { Link } from "react-router-dom"
import useModelos from "./hooks/useModelos"

let dummyModelo = {
    idModelo: 12,
    nombre: 'editado',
    cliente: 1,
}

const TestPaginaModelos = () => {

    const { allModelos, loading, errors, refreshModelos, saveModelo } = useModelos()

    if (loading) return <div>Loading...</div>

    if (errors) return <div>Errores...</div>

    return (
        <div className="flex flex-col p-5">
            <button onClick={refreshModelos}>REFETCH</button>
            <button
                className="normal-button"
                onClick={
                    () => saveModelo({values:dummyModelo, method:'PUT'})
                }>
                POST
            </button>
            {
                allModelos?.map((m, i) => 
                <div key={'M' + i}>
                    <Link to={`/modelos/${m.idModelo}`}>{m.nombre}</Link>
                </div>)
            }
        </div>
    )
}

export default TestPaginaModelos