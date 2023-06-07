import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import { sleep } from '../../constants/functions'
import { usePedidos } from './hooks/usePedidos'


const PaginaPedidos = () => {

  const { allPedidos, loading, refreshPedidos } = usePedidos()

  const modalContainerRef = useRef()
  const [listaPedidos, setListaPedidos] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    refreshPedidos()
  }, [])

  useEffect(() => {
    setListaPedidos(allPedidos)
    console.table(allPedidos)
  }, [allPedidos])

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

  const handleDeletePedidos = async () => {
    setSaving(true)
    await deletePedidos(listaPedidos)
    await refreshPedidos()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
  }


  return (
    <>

      <CRUD
        title='Pedidos'
        idName='idPedido'
        path='pedidos'
        loading={loading}
        allElements={allPedidos}
        elements={listaPedidos}
        setElements={setListaPedidos}
        columns={[
          { name: 'Pedido', attribute: 'idPedido' },
          { name: 'Fecha de registro', attribute: 'fechaRegistro' },
          { name: 'Fecha de entrega', attribute: 'fechaEntrega' },
          { name: 'Cliente', attribute: 'modelo.cliente.nombre' },
          { name: 'Modelo', attribute: 'modelo.nombre' },
        ]}
        onDelete={() => handleOpenModal(setDeleteModalVisible)}
      />

      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeletePedidos}
            elements={listaPedidos}
            representation={['modelo.nombre', 'idPedido']}
            message='Los siguientes Pedidos se eliminarán permanentemente:'
          />
        }
      </div>
    </>
  )
}
export default PaginaPedidos