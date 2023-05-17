import { useEffect, useRef } from "react"
import { useUsuarios } from "./hooks/useUsuarios"
import CRUD from "../../components/CRUD"
import DeleteModal from "../../components/DeleteModal"
import { useState } from "react"
import Loader from '../../components/Loader/Loader'
import { sleep } from '../../constants/functions'

const UsuariosColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'Apellidos', attribute: 'apellidos' },
  { name: 'Correo', attribute: 'correo' },
  { name: 'Usuario', attribute: 'usuario' },
  { name: 'Estado', attribute: 'estado' },
  { name: 'Tipo', attribute: 'tipo' },
]

const PaginaUsuarios = () => {

  const { allUsuarios, loading, setLoading, refreshUsuarios, deleteUsuarios } = useUsuarios()

  const modalContainerRef = useRef()
  const [listaUsuarios, setListaUsuarios] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    refreshUsuarios()
  }, [])

  useEffect(() => {
    setListaUsuarios(allUsuarios)
  }, [allUsuarios])


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

  const handleDeleteUsuarios = async () => {
    setSaving(true)
    await deleteUsuarios(listaUsuarios)
    await refreshUsuarios()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }

  return (
    <>

      <CRUD
        title='Usuarios'
        path='usuarios'
        idName='id'
        loading={loading}
        allElements={allUsuarios}
        elements={listaUsuarios}
        setElements={setListaUsuarios}
        columns={UsuariosColumns}
        onDelete={() => handleOpenModal(setDeleteModalVisible)}
      />

      <div className='modal absolute pointer-events-none z-50 h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeleteUsuarios}
            elements={listaUsuarios}
            representation={['nombre']}
            message='Los siguientes usurios serán eliminados de forma permanente'
          />
        }
      </div>
    </>
  )
}
export default PaginaUsuarios