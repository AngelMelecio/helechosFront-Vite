
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
      className="relative px-10 duration-200 total-center hover:bg-slate-100 active:opacity-70 active:duration-0">
      <div className={"total-center flex-1 font-semibold text-md " + (props.active ? "text-teal-700" : "text-gray-400")}>
        {props.children}
      </div>
      <div className={(props.active ? "bg-teal-500" : "bg-gray-200") + " z-10 w-full absolute h-1 bottom-0 "}>
      </div>

    </button>

  return (
    <div className='absolute w-full h-screen total-center grayTrans'>
      <div className='flex flex-col w-3/4 p-4 bg-white shadow-lg h-5/6 rounded-xl modal-box'>
        {/* HEADER */}
        <div className='relative flex flex-col w-full total-center'>
          <button
            className='absolute top-0 left-0 w-8 h-8 text-white rounded-lg neutral-button'
            onClick={onClose}
          >
            <ICONS.Cancel className='m-0' size='20px' />
          </button>
          <div className="text-xl font-bold text-teal-700 ">
            Detalles de la etiqueta: {etiqueta.numEtiqueta}
          </div>
          <div className="flex items-end pb-4">
            <p className="pr-1 text-sm font-normal text-gray-600"> Modelo: </p>
            <p className="pr-3 text-sm font-semibold text-gray-800 "> {modelo} </p>
            <p className="pr-1 text-sm font-normal text-gray-600"> Ficha: </p>
            <p className="pr-3 text-sm font-semibold text-gray-800 "> {ficha} </p>
            <p className="pr-1 text-sm font-normal text-gray-600"> Talla: </p>
            <p className="pr-3 text-sm font-semibold text-gray-800 "> {talla} </p>
          </div>
        </div>
        {/* TABS */}
        <div className="relative flex w-full h-10 mt-2 mb-5">
          <Tab
            id={0}
            onClick={() => setSelectedTab(0)}
            active={selectedTab === 0}>Detalles</Tab>
          <div className={" bg-gray-200 w-full absolute h-1 bottom-0 "}>
          </div>
        </div>
        {
          selectedTab === 0 &&
          <EtiquetaTimeline etiqueta={etiqueta} />
        }
      </div>
    </div>
  )
}
export default DetalleEtiquetaModal