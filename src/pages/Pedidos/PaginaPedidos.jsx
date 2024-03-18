import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { usePedidos } from './hooks/usePedidos'
import CrudPedidos from './components/CrudPedidos'

const PaginaPedidos = () => {

  const { allPedidos, loading, refreshPedidos } = usePedidos()

  useEffect(() => {refreshPedidos()}, [])

  return (

    <CrudPedidos
      title='Pedidos'
      idName='idPedido'
      path='pedidos'
      loading={loading}
      allElements={allPedidos}
    />

  )
}
export default PaginaPedidos