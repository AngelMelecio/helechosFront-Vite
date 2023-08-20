import { useState } from "react"
import { usePedidos } from "../hooks/usePedidos"
import { useEffect } from "react"
import chroma from "chroma-js"
import Chart from "react-google-charts"
import Loader from "../../../components/Loader/Loader"

const EtiquetaTimeline = ({etiqueta}) => {

    const { getRegistrosByIdProduccion } = usePedidos()
    const [registros, setRegistros] = useState([])
    const [rows, setRows] = useState([])
    const [ready, setReady] = useState(false)

    const columns = [
        { type: "string", id: "Departamento" },
        { type: "string", id: "Empleado" },
        { type: "date", id: "Start" },
        { type: "date", id: "End" },
    ];

    useEffect(async () => {
        const regs = await getRegistrosByIdProduccion(etiqueta.idProduccion)
        setRegistros(regs)
    }, [])

    useEffect(() => {
        let rous = registros.map((reg) => [
            reg[0],
            reg[1],
            new Date(reg[2]),
            new Date(reg[3])
        ])
        setRows(rous)
        setReady(true)
    }, [registros]);

    let options = {
        titleTextStyle: { fontSize: 18, bold: false, color: '#0f766e', },
        colors: chroma.scale(['#2A4858', '#fafa6e']).mode('lch').colors(7),
        legend: { textStyle: { color: '#1f2937', fontSize: 17 } },
        tooltip: { backgroundColor: '#000', textStyle: { color: '#1f2937', fontSize: 17 } },
        pieSliceTextStyle: { color: '#fff', fontSize: 14, textAlign: 'center' },
        backgroundColor: "transparent",
      }

    return (
        <div className="flex flex-col total-center flex-1 justify-center">
            <div className="flex flex-row h-full py-5 justify-center w-full">
                {ready && rows.length > 0 &&
                    <Chart chartType="Timeline"
                        data={[columns, ...rows]}
                        width="100%" height="100%"
                        options={options}
                        loader={<Loader />} />}
                {rows.length === 0 &&
                    <div className="total-center h-full">
                        <p className="italic font-semibold text-gray-600">
                            Esta etiqueta aun no ha sido escaneada ...
                        </p>
                    </div>}
            </div>
        </div>
    )
}
export default EtiquetaTimeline