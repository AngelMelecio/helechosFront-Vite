import React, { useRef } from 'react';
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
import Loader from '../components/Loader/Loader';
import CRUD from '../components/CRUD';
import DeleteModal from '../components/DeleteModal';
import { sleep } from '../constants/sleep';



const dumyFicha = {
  nombre: 'ROCUP-24-25-08-22',
  nombrePrograma:'S19120122',
  tipoMaquina: 'SF3-365-FL',
  fotografia:'',
  cliente: 'Flexi',
  talla: '27',

  maquinaTejido: 'ESP-32',
  tipoMaquinaTejido: 'R400-AK47',
  galga: '5',
  velocidadTejido: '12',
  tiempoBajada: '32',

  maquinaPlancha: 'PLANCHA-1123',
  velocidadPlancha: '23',
  temperaturaPlancha: '12',

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
  numeroPuntos: [
    { no: 1, puntos: 123 },
    { no: 2, puntos: 232 },
    { no: 3, puntos: 321 },
  ],
}

const puntoObj = {
  no: '',
  numeroPuntos: ''
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
  nombrePrograma: '',
  fotografia: '',
  cliente: '',
  talla: '',

  maquinaTejido: '',
  tipoMaquinaTejido: '',
  galga: '',
  velocidadTejido: '',
  tiempoBajada: '',

  maquinaPlancha: '',
  velocidadPlancha: '',
  temperaturaPlancha: '',

  numeroPuntos: [{ ...puntoObj }],
  jalones: [],
  economisadores: [],
  otros: '',

  pesoPoliester: '',
  pesoMelt: '',
  pesoLurex: '',

  fibras: [{ ...fibraObj }],
}

/*  dumy SHIT */
const getdumyFichas = async () => {
  const fichas = []
  for (let i = 0; i < 10; i++) {
    fichas.push({ ...dumyFicha, isSelected: false })
  }
  await sleep(1500)
  return fichas
}

export default function PaginaModelos() {

  const modalContainerRef = useRef()
  const deletemodalContainerRef = useRef()

  const [loading, setLoading] = useState(true)

  const [fichaTecnica, setFichaTecnica] = useState(initFichaTecnicaObj)

  const [allFichas, setAllFichas] = useState([])
  const [listaFichas, setListaFichas] = useState([])

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [printModalVisible, setPrintModalVisible] = useState(false)
  
  const [isEdit, setIsEdit] = useState(false)

  async function handleGetFichas() {
    setLoading(true)
    setAllFichas(await getdumyFichas())
    setLoading(false)
  }

  useEffect(() => {
    handleGetFichas()
  }, [])

  useEffect(() => {
    setListaFichas(allFichas)
  }, [allFichas])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }
  const [saving, setSaving] = useState(false)

  const handleSaveFicha = async (values) => {
    setSaving(true)
    setAllFichas(p => ([...p, { ...values }])
      .finally(setSaving(false)))
  }
  /*
  const handleOpenFrmModal = async () => {
    setFrmModalVisible(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseFrmModal = async () => {
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setFrmModalVisible(false)
  }
  const handleOpenDeleteModal = async () => {
    setDeleteModalVisible(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseDeleteModal = async () => {
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setDeleteModalVisible(false)
  }
  const handleOpenPrintModal = async () => {
    setPrintModalVisible(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleClosePrintModal = async () => {
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setPrintModalVisible(false)
  }
  const handleImprimir = async () => {

    let mdl = document.getElementById("form-modal")
    ReactDOM.render(
      <FichaTecnicaPrint
        data={dumyFicha}
        onCloseModal={() => handleModalVisibility(false)} />, mdl)
    await sleep(100)
    mdl.classList.add('visible')
    document.getElementById("tbl-page").classList.add('blurred')
    //    console.log( 'quiero imprimir:', listaFichas  ) 
  }

  const handleModalVisibility = async (show, obj = false) => {
    //console.log( fichaTecnica )
    let mdl = document.getElementById("form-modal");
    if (show) {
      ReactDOM.render(
        <FrmModelos
          onCloseModal={() => handleModalVisibility(false)}
          fichaTecnica={obj ? obj : initFichaTecnicaObj}
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
  }
*/
  const handleEdit = async (fich) => {
    setFichaTecnica(fich)
    handleOpenModal(setFrmModalVisible)
    setIsEdit(true)
  }

  return (
    <>
      {loading ? <Loader /> :
        <CRUD
          allElements={allFichas}
          elements={listaFichas}
          setElements={setListaFichas}
          columns={[{ name: 'Nombre', attribute: 'nombre' }]}
          onAdd={() => handleOpenModal(setFrmModalVisible)}
          onEdit={handleEdit}
          onDelete={() => handleOpenModal(setDeleteModalVisible)}
          onPrint={() => handleOpenModal(setPrintModalVisible)}
        />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {frmModalVisible &&
          <FrmModelos
            onCloseModal={() => handleCloseModal(setFrmModalVisible)}
            fichaTecnica={fichaTecnica}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        }
        {deleteModalVisible &&
          <DeleteModal
            onCancel={()=>handleCloseModal(setDeleteModalVisible)}
            onConfirm={() => console.log('confirmo eliminacion')}
            elements={listaFichas}
            representation={['nombre']}
            message='Las siguientes fichas serán eliminadas de forma permanente'
          />
        }
        {printModalVisible &&
          <FichaTecnicaPrint
            data={listaFichas}
            onCloseModal={() => handleCloseModal(setPrintModalVisible)}
          />
        }
      </div>
    </>
  )
}