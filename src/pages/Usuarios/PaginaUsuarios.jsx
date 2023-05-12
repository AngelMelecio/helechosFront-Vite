import { useEffect, useRef } from "react"
import { useUsuarios } from "./hooks/useUsuarios"
import CRUD from "../../components/CRUD"
import DeleteModal from "../../components/DeleteModal"
import { useState } from "react"

const UsuariosColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'Apellidos', attribute: 'apellidos' },
  { name: 'Correo', attribute: 'correo' },
  { name: 'Usuario', attribute: 'usuario' },
  { name: 'Estado', attribute: 'estado' },
  { name: 'Tipo', attribute: 'tipo' },
]

const PaginaUsuarios = () => {

  const {
    allUsuarios,
    loading,
    refreshUsuarios,
  } = useUsuarios()

  const [listaUsuarios, setListaUsuarios] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    refreshUsuarios()
  }, [])

  useEffect(() => {
    setListaUsuarios(allUsuarios)
  }, [allUsuarios])

  const modalContainerRef = useRef()

  const handleDelete = async () => {
    console.log("TODO: delete")
  }

  return (
    <>
      {
        <CRUD
          title='Usuarios'
          path='usuarios'
          idName='id'
          loading={loading}
          allElements={allUsuarios}
          elements={listaUsuarios}
          setElements={setListaUsuarios}
          columns={UsuariosColumns}
          //onAdd={() => handleOpenModal(setFrmModalVisible)}
          //onEdit={handleEdit}
          onDelete={() => handleOpenModal(setDeleteModalVisible)}
        />
      }
      <div className='modal absolute pointer-events-none z-50 h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDelete}
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