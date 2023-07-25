import { set } from "lodash";
import { ICONS } from "../../../constants/icons"
import { usePedidos } from "../hooks/usePedidos";
import React, { useState, useEffect, useRef } from 'react';
import { Chart } from "react-google-charts";
import chroma from 'chroma-js';
import Loader from "../../../components/Loader/Loader";


const DetalleEtiquetaModal = ({ onClose, etiqueta }) => {
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
    <div className='total-center h-screen w-full grayTrans absolute'>
      <div className='flex flex-col h-3/5 w-3/6 rounded-xl bg-white shadow-lg p-4 modal-box'>
        <div className='flex flex-row total-center w-full relative'>
          <button
            className='neutral-button p-1 text-white rounded-lg absolute left-0 top-0'
            onClick={onClose}
          >
            <ICONS.Cancel className='m-0' size='25px' />
          </button>
          <div className="font-semibold text-3xl text-teal-700 ">
            Detalles de la etiqueta {etiqueta.numEtiqueta}
          </div>
        </div>
        <div className="flex flex-col total-center w-full h-full justify-center">
          <div className="flex flex-row justify-center w-full">
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
      </div>
    </div>

  )
}
export default DetalleEtiquetaModal