import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import { useApp } from '../../context/AppContext'
import CRUD from '../../components/CRUD'
import Loader from '../../components/Loader/Loader'
import FrmEmpleados from '../../components/FrmEmpleados'
import { sleep } from '../../constants/functions'
import AppBar from '../../components/AppBar'
import { useEmpleados } from './hooks/useEmpleados'

const initobj = {
  idEmpleado: "",
  nombre: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  ns: "",
  fechaEntrada: "",
  fechaAltaSeguro: "",
  is_active: true,
  fotografia: "",
  departamento: "Seleccione",
}

const initErrors = {}

const PaginaEmpleados = () => {

  const { allEmpleados, loading, refreshEmpleados } = useEmpleados()

  const {
    empleadosColumns, getEmpleados, fetchingEmpleados,
    deleteEmpleados,
    getMaquinas
  } = useApp()

  const [listaEmpleados, setListaEmpleados] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const modalContainerRef = useRef()

  useEffect(() => {
    refreshEmpleados()
  }, [])

  useEffect(() => {
    setListaEmpleados(allEmpleados)
  }, [allEmpleados])

  const handleDeleteEmpleados = async () => {
    setSaving(true)
    await deleteEmpleados(listaEmpleados)
    await getEmpleados()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

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

  return (
    <>
      {
        <CRUD
          title='EMPLEADOS'
          path='empleados'
          idName='idEmpleado'
          loading={loading}
          allElements={allEmpleados}
          elements={listaEmpleados}
          setElements={setListaEmpleados}
          columns={empleadosColumns}
          //onAdd={() => handleOpenModal(setFrmModalVisible)}
          //onEdit={handleEdit}
          onDelete={() => handleOpenModal(setDeleteModalVisible)}
        />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeleteEmpleados}
            elements={listaEmpleados}
            representation={['nombre']}
            message='Las siguientes fichas serán eliminadas de forma permanente'
          />
        }
      </div>
    </>
  )
}
export default PaginaEmpleados