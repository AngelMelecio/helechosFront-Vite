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
import { useApp } from '../context/AppContext';

const initFichaTecnicaObj = {
  nombre: '',
  nombrePrograma: '',
  archivoPrograma:'',
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
  
  pesoPoliester: '',
  pesoMelt: '',
  pesoLurex: '',

  materiales: [],
  numeroPuntos: [],
  jalones: [],
  economisadores: [],
  otros: '',
}

export default function PaginaModelos() {

  const modalContainerRef = useRef()

  const {allModelos, getModelos} = useApp()

  const [loading, setLoading] = useState(true)

  const [fichaTecnica, setFichaTecnica] = useState(initFichaTecnicaObj)

  const [listaModelos, setListaModelos] = useState([])

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [printModalVisible, setPrintModalVisible] = useState(false)

  const [isEdit, setIsEdit] = useState(false)

  async function handleGetFichas() {
    setLoading(true)
    await getModelos()
    setLoading(false)
  }

  useEffect(() => {
    handleGetFichas()
  }, [])

  useEffect(() => {
    setListaModelos(allModelos)
  }, [allModelos])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    setIsEdit(false)
    setFichaTecnica(initFichaTecnicaObj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }
  const [saving, setSaving] = useState(false)

  const handleSaveFicha = async (values) => {
    console.log('quiero guardar')
  }

  const handleEdit = async (fich) => {
    setFichaTecnica(fich)
    handleOpenModal(setFrmModalVisible)
    setIsEdit(true)
  }

  return (
    <>
      {loading ? <Loader /> :
        <CRUD
          allElements={allModelos}
          elements={listaModelos}
          setElements={setListaModelos}
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
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={() => console.log('confirmo eliminacion')}
            elements={listaModelos}
            representation={['nombre']}
            message='Las siguientes fichas serán eliminadas de forma permanente'
          />
        }
        {printModalVisible &&
          <FichaTecnicaPrint
            data={listaModelos}
            onCloseModal={() => handleCloseModal(setPrintModalVisible)}
          />
        }
      </div>
    </>
  )
}