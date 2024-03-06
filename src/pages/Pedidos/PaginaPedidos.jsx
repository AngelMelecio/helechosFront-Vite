import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import { sleep } from '../../constants/functions'
import { usePedidos } from './hooks/usePedidos'
import ProgressBar from "@ramonak/react-progress-bar";
import { get, toInteger } from 'lodash'
import CrudPedidos from './components/CrudPedidos'
import Progress from './components/Progress'



const PaginaPedidos = () => {

  const { allPedidos, loading, refreshPedidos } = usePedidos()

  useEffect(() => {
    refreshPedidos()
  }, [])

  useEffect(() => {
    console.log('EFECTO PAGINA', allPedidos)

  }, [allPedidos])


  function colorProgress(progress) {
    let color = ''

    if (progress <= 25) {
      color = '#9b1b1b'
    } else if (progress <= 50) {
      color = '#ea580c'
    } else if (progress <= 75) {
      color = '#eab308'
    } else {
      color = '#15803d'
    }
    return color
  }

  return (
    <>
      <CrudPedidos
        title='Pedidos'
        idName='idPedido'
        path='pedidos'
        loading={loading}
        allElements={allPedidos}

      /*
    mainRowsRef="cliente"
    subRowsRef="pedidos"

    mainColumns={[
      { name: 'ID', attribute: 'idCliente' },
      { name: 'Nombre', attribute: 'cliente.nombre' },
      { name: 'Progreso del cliente', attribute: (e) => <ProgressBar completed={toInteger(Number((e.cliente.progreso) * 100) / Number(e.cliente.total))}
        maxCompleted={100}
        className='w-full'
        animateOnRender={true}
        labelAlignment='left'
        labelColor='#fff'
        bgColor={colorProgress(toInteger(Number((e.cliente.progreso) * 100) / Number(e.cliente.total)))} />
      }
    ]}

    subColumns={[
      { name: 'Pedido', attribute: 'idPedido' },
      { name: 'Orden de compra', attribute: 'ordenCompra' },
      { name: 'Fecha de registro', attribute: 'fechaRegistro', type: 'dateTime' },
      { name: 'Fecha de entrega', attribute: 'fechaEntrega', type: 'date' },
      { name: 'Cliente', attribute: 'modelo.cliente.nombre' },
      { name: 'Modelo', attribute: 'modelo.nombre' },
      { name: 'Pares terminados', attribute: 'fraccion' },
      {
        name: 'Progreso del pedido', attribute: (e) => <ProgressBar completed={toInteger(Number((e.progreso.progreso) * 100) / Number(e.progreso.total))}
          maxCompleted={100}
          className='w-full '
          animateOnRender={true}
          labelAlignment='left'
          labelColor='#fff'
          bgColor={colorProgress(toInteger(Number((e.progreso.progreso) * 100) / Number(e.progreso.total)))} />
      }
    ]}
   
    setElements={setListaPedidos}*/

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
    </>
  )
}
export default PaginaPedidos