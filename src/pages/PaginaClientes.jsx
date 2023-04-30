import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import { useApp } from '../context/AppContext'
import CRUD from '../components/CRUD'
import Loader from '../components/Loader/Loader'
import { sleep } from '../constants/sleep'
import FrmClientes from '../components/FrmClientes'
import AppBar from '../components/AppBar'

const initobj = {
  idCliente: "",
  nombre: "",
  direccion: "",
  correo: "",
  contactos: [{ "nombre": "", "puesto": "", "correo": "", "telefono": "", "nota": "" }],
  otro: ""
}

const PaginaClientes = () => {

  const {
    fetchingClientes,
    allClientes,
    clientesColumns,
    getClientes,
    saveClientes,
    deleteClientes
  } = useApp()

  const modalContainerRef = useRef()

  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const [objCliente, setObjCliente] = useState(initobj);
  const [listaClientes, setListaClientes] = useState()

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [saving, setSaving] = useState(false)

  async function handleGetData() {
    setLoading(true)
    await getClientes()
    setLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  useEffect(() => {
    setListaClientes(allClientes)
  }, [allClientes])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    setIsEdit(false)
    setObjCliente(initobj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleDleteClientes = async () => {
    setSaving(true)
    await deleteClientes(listaClientes)
    await getClientes()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

  const handleEdit = async (cliente) => {
    setObjCliente(cliente)
    setIsEdit(true)
    handleOpenModal(setFrmModalVisible)
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <CRUD
            allElements={allClientes}
            elements={listaClientes}
            setElements={setListaClientes}
            columns={clientesColumns}
            onAdd={() => handleOpenModal(setFrmModalVisible)}
            onEdit={handleEdit}
            onDelete={() => handleOpenModal(setDeleteModalVisible)}
          />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {frmModalVisible &&
          <FrmClientes
            onCloseModal={() => handleCloseModal(setFrmModalVisible)}
            cliente={objCliente}
            isEdit={isEdit}
          />

        }
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDleteClientes}
            elements={listaClientes}
            representation={['nombre', 'direccion', 'telefono', 'correo']}
            message='Los siguientes clientes se eliminarán permanentemente:'
          />
        }
      </div>
    </>
  )
}
export default PaginaClientes