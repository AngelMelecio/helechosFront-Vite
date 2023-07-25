import React, { useState, useEffect } from 'react';

const ProgressBar = ({ ruta, estacion }) => {

    const [progress, setProgress] = useState([])

    useEffect(() => {
        let pgrss = []
        let ps = 'creada'
        let f = true
        while (ps !== 'entregado') {
            if (ps === estacion) f = false
            pgrss.push({ station: ps, completed: f })
            ps = ruta[ps]
        }
        setProgress(pgrss)
    }, [estacion])

    return (
        <div className='flex w-full'>
            {
                progress?.map((p, indx) => <div className='flex flex-1 items-center'>
                    <div
                        style={{ 
                            backgroundColor: p.completed ? '#10B981' : '#D1D5DB', 
                            transition: 'background-color, border 0.5s ease',
                            border: (indx && !p.completed && progress[indx-1].completed) ? '3px solid #10B981' : '3px solid #D1D5DB'
                        }}
                        className="w-6 h-6 rounded-full">

                    </div>
                    {indx < progress.length - 1 && <div
                        style={{ backgroundColor: '#D1D5DB' }}
                        className="flex relative h-2 flex-grow mx-1">
                        <div
                            style={{ width: p.completed ? '100%' : '0%', transition: 'all 0.5s ease' }}
                            className={`absolute h-full bg-teal-600`}>
                        </div>
                    </div>}
                </div>)
            }
        </div>
    );
};

let estaciones = [
    'creada',
    'corte',
    'ensamble',
    'pulido',
    'entregado',
]

const TestComp = () => {

    const [ruta, setRuta] = useState({
        creada: "corte",
        corte: "ensamble",
        ensamble: "pulido",
        pulido: "entregado",
        entregado: "entregado"
    })

    const [estacion, setEstacion] = useState("creada")


    return (
        <div className='flex flex-col w-full'>
            <div className="w-full h-full total-center ">
                <ProgressBar ruta={ruta} estacion={estacion} />
            </div>
            <button
                onClick={() => {
                    setEstacion(  estaciones[ estaciones.indexOf( estacion ) + 1 < estaciones.length ? estaciones.indexOf( estacion ) + 1 : 0  ] )
                }}
                className='h-10 bg-emerald-500'>
                Change
            </button>
        </div>
    )
}
export default TestComp