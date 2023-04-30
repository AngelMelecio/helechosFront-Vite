import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import { useApp } from '../context/AppContext'
import CRUD from '../components/CRUD'
import Loader from '../components/Loader/Loader'
import { sleep } from '../constants/sleep'
import FrmMateriales from '../components/FrmMateriales'
import AppBar from '../components/AppBar'

const initobj = {
  idMaterial: "",
  tipo: "Seleccione",
  color: "",
  calibre: "Seleccione",
  proveedor: "Seleccione",
  tenida: "",
  codigoColor: "#ffffff",
  idProveedor: "Seleccione",
  nombreProveedor: "",
}

const PaginaMateriales = () => {

  const {
    fetchingMateriales,
    allMateriales,
    materialesColumns,
    getMateriales,
    saveMateriales,
    deleteMateriales
  } = useApp()

  const modalContainerRef = useRef()

  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const [objMaterial, setObjMaterial] = useState(initobj);
  const [listaMateriales, setListaMateriales] = useState()

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [saving, setSaving] = useState(false)

  async function handleGetData() {
    setLoading(true)
    await getMateriales()
    setLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  useEffect(() => {
    setListaMateriales(allMateriales)
  }, [allMateriales])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    setIsEdit(false)
    setObjMaterial(initobj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleDleteMateriales = async () => {
    setSaving(true)
    await deleteMateriales(listaMateriales)
    await getMateriales()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

  const handleEdit = async (material) => {
    setObjMaterial(material)
    setIsEdit(true)
    handleOpenModal(setFrmModalVisible)
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <CRUD
            allElements={allMateriales}
            elements={listaMateriales}
            setElements={setListaMateriales}
            columns={materialesColumns}
            onAdd={() => handleOpenModal(setFrmModalVisible)}
            onEdit={handleEdit}
            onDelete={() => handleOpenModal(setDeleteModalVisible)}
          />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {frmModalVisible &&
          <FrmMateriales
            onCloseModal={() => handleCloseModal(setFrmModalVisible)}
            material={objMaterial}
            isEdit={isEdit}
          />

        }
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDleteMateriales}
            elements={listaMateriales}
            representation={['color', 'tenida']}
            message='Los siguientes materiales se eliminarán permanentemente:'
          />
        }
      </div>

    </>
  )
}
export default PaginaMateriales