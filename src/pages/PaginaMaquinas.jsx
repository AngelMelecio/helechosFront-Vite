import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../components/DeleteModal'
import { useFormik } from 'formik'

import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import CRUD from '../components/CRUD'
import FrmMaquinas from '../components/FrmMaquinas'
import Loader from '../components/Loader/Loader'
import { sleep } from '../constants/sleep'

const initobj = {
  idMaquina: "",
  numero: "",
  linea: "0",
  marca: "",
  modelo: "",
  ns: "",
  fechaAdquisicion: "",
  otros: "",
  detalleAdquisicion: "",
  departamento: "Seleccione"
}

const PaginaMaquinas = () => {

  const {
    fetchingMaquinas,
    allMaquinas,
    maquinasColumns,
    getMaquinas,
    saveMaquina,
    deleteMaquinas
  } = useApp()

  const modalContainerRef = useRef()

  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const [objMaquina, setObjMaquina] = useState(initobj);
  const [listaMaquinas, setListaMaquinas] = useState()

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [saving, setSaving] = useState(false)

  async function handleGetData() {
    setLoading(true)
    await getMaquinas()
    setLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  useEffect(()=>{
    setListaMaquinas(allMaquinas)
  },[allMaquinas])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    setIsEdit(false)
    setObjMaquina(initobj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleDleteMaquinas = async () => {
    setSaving(true)
    await deleteMaquinas(listaMaquinas)
    await getMaquinas()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

  const handleEdit = async (mac) => {
    setObjMaquina(mac)
    setIsEdit(true)
    handleOpenModal(setFrmModalVisible)
  }

  return (
    <>
      {
        loading ? <Loader/> :
        <CRUD
          allElements={allMaquinas}
          elements={listaMaquinas}
          setElements={setListaMaquinas}
          columns={maquinasColumns}
          onAdd={() => handleOpenModal(setFrmModalVisible)}
          onEdit={handleEdit}
          onDelete={() => handleOpenModal(setDeleteModalVisible)}
        />
      }
       <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {frmModalVisible &&
          <FrmMaquinas
            onCloseModal={()=>handleCloseModal(setFrmModalVisible)}
            maquina={objMaquina}
            isEdit={isEdit}
          />

        }
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDleteMaquinas}
            elements={listaMaquinas}
            representation={['numero', 'linea', 'marca', 'modelo']}
            message='Las siguientes maquinas se eliminarán permanentemente:'
          />
        }
       </div>
    </>
  )
}
export default PaginaMaquinas