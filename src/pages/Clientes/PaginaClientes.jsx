import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import { sleep } from '../../constants/functions'
import { useClientes } from './hooks/useClientes'


const PaginaClientes = () => {

  const { allClientes, loading, refreshClientes, deleteClientes } = useClientes()

  const modalContainerRef = useRef()
  const [listaClientes, setListaClientes] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    refreshClientes()
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
    modalContainerRef.current.classList.remove('visible')
    document.getElementById("tbl-page").classList.remove('blurred')
    await sleep(150)
    setState(false)
  }

  const handleDeleteClientes = async () => {
    setSaving(true)
    await deleteClientes(listaClientes)
    await refreshClientes()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }


  return (
    <>

      <CRUD
        title='Clientes'
        idName='idCliente'
        path='clientes'
        loading={loading}
        allElements={allClientes}
        elements={listaClientes}
        setElements={setListaClientes}
        columns={[
          { name: 'Nombre', attribute: 'nombre' },
          { name: 'RFC', attribute: 'rfc' },
          { name: 'Dirección', attribute: 'direccion' },
          { name: 'Teléfono', attribute: 'telefono' },
          { name: 'Correo', attribute: 'correo' },
          { name: 'Otro', attribute: 'otro' },
        ]}
        onDelete={() => handleOpenModal(setDeleteModalVisible)}
      />

      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeleteClientes}
            elements={listaClientes}
            representation={['nombre', 'rfc']}
            message='Los siguientes clientes se eliminarán permanentemente:'
          />
        }
      </div>
    </>
  )
}
export default PaginaClientes