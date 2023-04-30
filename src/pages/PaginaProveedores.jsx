import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import { useApp } from '../context/AppContext'
import CRUD from '../components/CRUD'
import Loader from '../components/Loader/Loader'
import { sleep } from '../constants/sleep'
import FrmProveedores from '../components/FrmProveedores'
import AppBar from '../components/AppBar'

const initobj = {
  idProveedor: "",
  nombre: "",
  direccion: "",
  telefono: "",
  correo: "",
  departamento: "Seleccione",
  contactos: [{ "nombre": "", "puesto": "", "correo": "", "telefono": "", "nota": "" }],
  otro: ""
}

const PaginaProveedores = () => {

  const {
    fetchingProveedores,
    allProveedores,
    proveedoresColumns,
    getProveedores,
    saveProveedores,
    deleteProveedores
  } = useApp()

  const modalContainerRef = useRef()

  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const [objProveedor, setObjProveedor] = useState(initobj);
  const [listaProveedores, setListaProveedores] = useState()

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [saving, setSaving] = useState(false)

  async function handleGetData() {
    setLoading(true)
    await getProveedores()
    setLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  useEffect(() => {
    setListaProveedores(allProveedores)
  }, [allProveedores])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    setIsEdit(false)
    setObjProveedor(initobj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleDleteProveedores = async () => {
    setSaving(true)
    await deleteProveedores(listaProveedores)
    await getProveedores()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

  const handleEdit = async (proveedor) => {
    setObjProveedor(proveedor)
    setIsEdit(true)
    handleOpenModal(setFrmModalVisible)
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <CRUD
            allElements={allProveedores}
            elements={listaProveedores}
            setElements={setListaProveedores}
            columns={proveedoresColumns}
            onAdd={() => handleOpenModal(setFrmModalVisible)}
            onEdit={handleEdit}
            onDelete={() => handleOpenModal(setDeleteModalVisible)}
          />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {frmModalVisible &&
          <FrmProveedores
            onCloseModal={() => handleCloseModal(setFrmModalVisible)}
            proveedor={objProveedor}
            isEdit={isEdit}
          />

        }
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDleteProveedores}
            elements={listaProveedores}
            representation={['nombre']}
            message='Los siguientes proveedores se eliminarán permanentemente:'
          />
        }
      </div>
    </>
  )
}
export default PaginaProveedores