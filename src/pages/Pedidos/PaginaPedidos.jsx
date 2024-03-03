import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import { sleep } from '../../constants/functions'
import { usePedidos } from './hooks/usePedidos'
import ProgressBar from "@ramonak/react-progress-bar";
import { get } from 'lodash'
import CrudPedidos from './components/CrudPedidos'

const PaginaPedidos = () => {

  const { allPedidos, loading, refreshPedidos, deletePedidos } = usePedidos()

  const modalContainerRef = useRef()
  const [listaPedidos, setListaPedidos] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    refreshPedidos()
  }, [])

  useEffect(() => {
    setListaPedidos(allPedidos)
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
      <CrudPedidos
        title='Pedidos'
        idName='idPedido'
        path='pedidos'
        loading={loading}
        allElements={allPedidos}
        elements={listaPedidos}
        setElements={setListaPedidos}
        columns={[
          { name: 'Pedido', attribute: 'idPedido' },
          { name: 'Fecha de registro', attribute: 'fechaRegistro', type: 'dateTime' },
          { name: 'Fecha de entrega', attribute: 'fechaEntrega', type: 'date' },
          { name: 'Cliente', attribute: 'modelo.cliente.nombre' },
          { name: 'Modelo', attribute: 'modelo.nombre' },
          { name: 'Orden de compra', attribute: 'ordenCompra' },
          {
            name: 'Progreso del pedido', attribute: (e) => <ProgressBar completed={e.progressBar.progress}
              maxCompleted={e.progressBar.goal}
              className='w-full'
              bgColor={e.progressBar.color} />
          }
        ]}
        onDelete={() => handleOpenModal(setDeleteModalVisible)}
      />
      {
        /*
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
              { name: 'Fecha de registro', attribute: 'fechaRegistro', type: 'dateTime' },
              { name: 'Fecha de entrega', attribute: 'fechaEntrega', type: 'date'},
              { name: 'Cliente', attribute: 'modelo.cliente.nombre' },
              { name: 'Modelo', attribute: 'modelo.nombre' },
              { name: 'Orden de compra', attribute: 'ordenCompra' },
              {
                name: 'Progreso del pedido', attribute: (e) => <ProgressBar completed={e.progressBar.progress}
                  maxCompleted={e.progressBar.goal}
                  className='w-full'
                  bgColor={e.progressBar.color} />
              }
            ]}
            onDelete={() => handleOpenModal(setDeleteModalVisible)}
          />
        */
      }

      <div className='absolute z-50 w-full h-full modal' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeletePedidos}
            elements={listaPedidos}
            representation={['idPedido']}
            message='Los siguientes Pedidos se eliminarán permanentemente:'
          />
        }
      </div>
    </>
  )
}
export default PaginaPedidos