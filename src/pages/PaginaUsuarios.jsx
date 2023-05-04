import { useFormik } from "formik"
import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"
import CRUD from "../components/CRUD"
import CustomSelect from "../components/CustomSelect"
import DeleteModal from "../components/DeleteModal"
import FrmUsuarios from "../components/FrmUsuarios"
import Input from "../components/Input"
import Loader from "../components/Loader/Loader"
import Table from "../components/Table"
import { ICONS } from "../constants/icons"
import { sleep } from "../constants/functions"
import { useAdmin } from "../context/AdminContext"
import { useAuth } from "../context/AuthContext"
import AppBar from "../components/AppBar"

const apiUserUrl = 'http://localhost:8000/users/'

const initobj = {
  nombre: '',
  apellidos: '',
  correo: '',
  usuario: '',
  password: '',
  is_active: true,
  is_staff: false
}

const PaginaUsuarios = () => {

  const modalContainerRef = useRef()
  const modalBoxRef = useRef()
  const newPassRef = useRef()
  const pageRef = useRef()

  const { session, notify } = useAuth()

  const {
    getUsuarios,
    allUsuarios,
    UsuariosColumns,
    deleteUsuarios

  } = useAdmin()

  const [frmModalVisible, setFrmModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [objUsuario, setObjUsuario] = useState(initobj)
  const [listaUsuarios, setListaUsuarios] = useState([])
  const [isEdit, setIsEdit] = useState(false)

  async function handleGetData() {
    setLoading(true)
    await getUsuarios()
    setLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  useEffect(async () => {
    setListaUsuarios(allUsuarios)
  }, [allUsuarios])

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    document.getElementById("tbl-page").classList.add('blurred')
    modalContainerRef.current.classList.add('visible')
  }
  const handleCloseModal = async (setState) => {
    setIsEdit(false)
    setObjUsuario(initobj)
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleDeleteUsuarios = async () => {
    setSaving(true)
    await deleteUsuarios(listaUsuarios)
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

  const handleEdit = (usr) => {
    handleOpenModal(setFrmModalVisible)
    setIsEdit(true)
    setObjUsuario(usr)
  }

  return (
    <>
      {loading ? <Loader /> :
        <CRUD
          allElements={allUsuarios}
          elements={listaUsuarios}
          setElements={setListaUsuarios}
          columns={UsuariosColumns}
          onAdd={() => handleOpenModal(setFrmModalVisible)}
          onEdit={handleEdit}
          onDelete={() => handleOpenModal(setDeleteModalVisible)}
        />
      }
      {<div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {frmModalVisible &&
          <FrmUsuarios
            onCloseModal={() => handleCloseModal(setFrmModalVisible)}
            usuario={objUsuario}
            isEdit={isEdit}
          />
        }
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeleteUsuarios}
            elements={listaUsuarios}
            representation={['nombre', 'apellidos']}
            message='Los siguientes usuarios se eliminarán permanentemente:'
          />
        }
      </div>}
    </>
  )
}
export default PaginaUsuarios