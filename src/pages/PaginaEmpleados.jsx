import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import { useApp } from '../context/AppContext'
import CRUD from '../components/CRUD'
import Loader from '../components/Loader/Loader'
import FrmEmpleados from '../components/FrmEmpleados'
import { sleep } from '../constants/sleep'

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

  const {
    empleadosColumns, getEmpleados, fetchingEmpleados,
    allEmpleados, deleteEmpleados,
    getMaquinas
  } = useApp()

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const [objEmpleado, setObjEmpleado] = useState(initobj)
  const [listaEmpleados, setListaEmpleados] = useState([])

  const modalContainerRef = useRef()

  const [shown, setShown] = React.useState(false);
  const switchShown = () => setShown(!shown);

  async function handleGetData() {
    setLoading(true)
    await getEmpleados()
    setLoading(false)
  }

  useEffect(() => {
    handleGetData()
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
    setIsEdit(false)
    setObjEmpleado(initobj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleEdit = async (emp) => {
    setObjEmpleado(emp)
    setIsEdit(true)
    handleOpenModal(setFrmModalVisible)
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <CRUD
            allElements={allEmpleados}
            elements={listaEmpleados}
            setElements={setListaEmpleados}
            columns={empleadosColumns}
            onAdd={() => handleOpenModal(setFrmModalVisible)}
            onEdit={handleEdit}
            onDelete={() => handleOpenModal(setDeleteModalVisible)}
          />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {frmModalVisible &&
          <FrmEmpleados
            onCloseModal={() => handleCloseModal(setFrmModalVisible)}
            empleado={objEmpleado}
            isEdit={isEdit}
          />
        }
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