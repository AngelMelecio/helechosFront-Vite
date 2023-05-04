import React, { useRef } from 'react';
import { useState } from "react";
import FichaTecnicaPrint from "../components/FichaTecnicaPrint";
import { useEffect } from 'react';
import FrmModelos from '../components/FrmModelos';
import Loader from '../components/Loader/Loader';
import CRUD from '../components/CRUD';
import DeleteModal from '../components/DeleteModal';
import { sleep } from '../constants/functions';
import { useApp } from '../context/AppContext';

const initModeloObj= {
  idModelo:'',
  nombre:'',
  idCliente: 'Seleccione',
}

const initFichaTecnicaObj = {
  modelo:'',
  nombre: '',
  archivoPrograma: null,
  fotografia: null,
  talla: '',

  maquinaTejido: '',
  tipoMaquinaTejido: '',
  galga: '',
  velocidadTejido: '',
  tiempoBajada: '',

  maquinaPlancha: '',
  velocidadPlancha: '',
  temperaturaPlancha: '',

  pesoPoliester: 0,
  pesoMelt: 0,
  pesoLurex: 0,

  materiales: [],
  numeroPuntos: [{ valor: '', posicion: '' }],
  jalones: [{ valor: '', posicion: '' }],
  economisadores: [{ valor: '', posicion: '' }],
  otros: '',

  idMaquinaTejido: 'Seleccione',
  nombreMaquinaTejido: '',

  idMaquinaPlancha: 'Seleccione',
  nombreMaquinaPlancha: ''
}

export default function PaginaModelos() {

  const modalContainerRef = useRef()

  const { allModelos, getModelos, deleteModelos } = useApp()
  const [loading, setLoading] = useState(true)
  const [modelo, setModelo] = useState(initModeloObj)

  const [listaModelos, setListaModelos] = useState([])

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [printModalVisible, setPrintModalVisible] = useState(false)

  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)


  async function handleGetModelos() {
    setLoading(true)
    await getModelos()
    setLoading(false)
  }

  useEffect(() => {
      handleGetModelos()
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
    setModelo(initModeloObj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleDeleteModelos = async () => {
    setSaving(true)
    await deleteModelos(listaModelos)
    await getModelos()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

  const handleEdit = async (mod) => {
    setModelo(mod)
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
            Modelo={modelo}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            initFichaObj={initFichaTecnicaObj}
          />
        }
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeleteModelos}
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