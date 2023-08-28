
import { ICONS } from "../../../constants/icons"
import React, { useState, useEffect, useRef } from 'react';
import EtiquetaTimeline from "./EtiquetaTimeline";
import ReposicionesCrud from "./ReposicionesCrud";

const DetalleEtiquetaModal = ({ onClose, etiqueta, modelo, ficha, talla }) => {

  const [selectedTab, setSelectedTab] = useState(0)

  const Tab = (props) =>
    <button
      type="button"
      onClick={props.onClick}
      className="total-center px-10 relative duration-200  hover:bg-slate-100 active:opacity-70 active:duration-0">
      <div className={"total-center flex-1 font-semibold text-md " + (props.active ? "text-teal-700" : "text-gray-400")}>
        {props.children}
      </div>
      <div className={(props.active ? "bg-teal-500" : "bg-gray-200") + " z-10 w-full absolute h-1 bottom-0 "}>
      </div>

    </button>

  return (
    <div className='total-center h-screen w-full grayTrans absolute'>
      <div className='flex flex-col h-5/6 w-3/4 rounded-xl bg-white shadow-lg p-4 modal-box'>
        {/* HEADER */}
        <div className='flex flex-col total-center w-full relative'>
          <button
            className='neutral-button h-8 w-8 text-white rounded-lg absolute left-0 top-0'
            onClick={onClose}
          >
            <ICONS.Cancel className='m-0' size='20px' />
          </button>
          <div className="font-bold text-xl text-teal-700 ">
            Detalles de la etiqueta: {etiqueta.numEtiqueta}
          </div>
          <div className="flex items-end pb-4">
            <p className="text-gray-600 font-normal text-sm pr-1"> Modelo: </p>
            <p className=" text-gray-800 text-sm pr-3 font-semibold"> {modelo} </p>
            <p className="text-gray-600 font-normal text-sm pr-1"> Ficha: </p>
            <p className=" text-gray-800 text-sm pr-3 font-semibold"> {ficha} </p>
            <p className="text-gray-600 font-normal text-sm pr-1"> Talla: </p>
            <p className=" text-gray-800 text-sm pr-3 font-semibold"> {talla} </p>
          </div>
        </div>
        {/* TABS */}
        <div className="h-10 mt-2 mb-5 flex w-full relative">
          <Tab
            id={0}
            onClick={() => setSelectedTab(0)}
            active={selectedTab === 0}>Detalles</Tab>
          <Tab
            id={1}
            onClick={() => setSelectedTab(1)}
            active={selectedTab === 1}>Reposiciones</Tab>
          <div className={" bg-gray-200 w-full absolute h-1 bottom-0 "}>
          </div>
        </div>
        {
          selectedTab === 0 &&
          <EtiquetaTimeline etiqueta={etiqueta} />
        }
        {
          selectedTab === 1 &&
          <ReposicionesCrud
            produccion={etiqueta?.idProduccion}
          />
        }

      </div>
    </div>
  )
}
export default DetalleEtiquetaModal