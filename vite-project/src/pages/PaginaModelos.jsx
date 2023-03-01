import React from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from "formik";
import { useState } from "react";
import FichaTecnicaPrint from "../components/FichaTecnicaPrint";
import Input from "../components/Input";
import { ICONS } from "../constants/icons";
import { createRef } from "react";
import { useEffect } from 'react';
import Table from '../components/Table';
import FrmModelos from '../components/FrmModelos';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const dummyFicha = {
  nombre: 'ROCUP-24-25-08-22',
  tipoMaquina: 'SF3-365-FL',
  modelo: '031',
  numeroMaquina: '91',
  galga: '14',
  cliente: 'Flexi',
  talla: '27',
  velocidad: '25',
  tiempoBajada: '65',
  pesoPoliester: '12',
  pesoMelt: '546',
  pesoLurex: '648',

  fibras: [
    { guiaHilos: '2L', fibras: 'polieste', calibre: 123, proveedor: 'Divixion', color: 'marfil', hebras: 2, otro: '1 Goma' },
    { guiaHilos: '2L', fibras: 'polieste', calibre: 150, proveedor: 'Sajitex', color: 'Beige', hebras: 1, otro: '1 Melt' },
    { guiaHilos: '3L', fibras: 'polieste', calibre: 150, proveedor: 'Sajitex', color: 'marfil', hebras: 4, otro: '1 Goma Blanca' },
    { guiaHilos: '4R', fibras: 'polieste', calibre: 150, proveedor: 'Sajitex', color: 'marfil', hebras: 2, otro: '1 Goma' },
    { guiaHilos: '5L', fibras: 'polieste', calibre: 150, proveedor: 'Sajitex', color: 'marfil', hebras: 1, otro: '1 Goma' },
    { guiaHilos: '6R', fibras: 'polieste', calibre: 123, proveedor: 'Divixion', color: 'marfil', hebras: 2, otro: '1 Goma' },],
  puntos: [
    { no: 1, puntos: 123 },
    { no: 2, puntos: 232 },
    { no: 3, puntos: 321 },
  ],
}
const puntoObj = {
  no: '',
  puntos: ''
}

const fibraObj = {
  guiaHilos: '',
  fibras: '',
  calibre: '', 
  proveedor: '',
  color: '',
  hebras: '',
  otro: ''
}
const initFichaTecnicaObj = {
  nombre: '',
  tipoMaquina: '',
  modelo: '',
  numeroMaquina: '',
  galga: '',
  cliente: '',
  talla: '',
  velocidad: '',
  tiempoBajada: '',
  pesoPoliester: '',
  pesoMelt: '',
  pesoLurex: '',

  fibras: [{ ...fibraObj }],
  puntos: [{ ...puntoObj }],

}

export default function PaginaModelos() {

  const [fichaTecnica, setFichaTecnica] = useState(() => { console.log(dummyFicha); return dummyFicha })

  const [allFichas, setAllFichas] = useState( ()=>{
    const fichas = []
    for (let i = 0; i < 10; i++) {
      fichas.push(dummyFicha)
    }
    return fichas
  } )
  const [listaFichas, setListaFichas] = useState([])

  useEffect(()=>{
    setListaFichas(allFichas)
  },[allFichas])

  const [saving, setSaving] = useState(false)
  const [isEdit, setIsEdit] = useState(false)


  const handleSaveFicha = async(values) =>{
    setSaving(true)
    setAllFichas( p => ([ ...p, {...values} ])
      .finally( setSaving(false) ) )
  }

  const handleImprimir = () => { 
    
  }


  const handleModalVisibility = async (show, edit) => {
    let mdl = document.getElementById("form-modal");
    if (show) {
      ReactDOM.render(
      <FrmModelos 
        onCloseModal={() => handleModalVisibility(false, false)}
        fichaTecnica={fichaTecnica}
        setFichaTecnica={setFichaTecnica}
        isEdit={isEdit}
        setIsEdit={setIsEdit}

        />, mdl)
        await sleep(100)  
        mdl.classList.add('visible')
        document.getElementById("tbl-page").classList.add('blurred')
    }
    else {
      mdl.classList.remove('visible')
      await sleep(100);
      document.getElementById("tbl-page").classList.remove('blurred')
      ReactDOM.render(<></>, mdl)
    }
    if( !edit ){
      setFichaTecnica(initFichaTecnicaObj)
    }

  }

  const handleEdit = async (fich) => {
    handleModalVisibility(true, true)
    setIsEdit(true)
    setFichaTecnica(fich)
  }

  return (
    <>
      <Table
        allItems={allFichas}
        visibleItems={listaFichas}
        setVisibleItems={setListaFichas}
        columns={[{ name: 'Nombre', attribute: 'nombre' }]}
        onAdd={() => handleModalVisibility(true, false)}
        onDelete={() => { /*handleModalDeleteVisibility(true) */ }}
        onEdit={() => { }}
      />
      <div id="form-modal" name="form-modal" className='modal absolute h-full w-full'></div>
    </>
  )
}