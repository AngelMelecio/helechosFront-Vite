import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import { useApp } from '../../context/AppContext'
import CRUD from '../../components/CRUD'
import Loader from '../../components/Loader/Loader'
import FrmEmpleados from '../../components/FrmEmpleados'
import { sleep } from '../../constants/functions'
import AppBar from '../../components/AppBar'
import { useEmpleados } from './hooks/useEmpleados'

const initobj = {
  idEmpleado: "",
  nombre: "",
  apellidos: "",
  direccion: "",
  telefono: "",
  ns: "",
  fechaEntrada: "",
  fechaAltaSeguro: "",
  is_active: true,
  fotografia: "",
  departamento: "Seleccione",
}

const empleadosColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'Apellidos', attribute: 'apellidos' },
  { name: 'Dirección', attribute: 'direccion' },
  { name: 'Seguro Social', attribute: 'ns' },
  { name: 'Fecha de Contratación', attribute: 'fechaEntrada' },
  { name: 'Fecha Alta de Seguro', attribute: 'fechaAltaSeguro' },
  { name: 'Estado', attribute: 'estado' },
  { name: 'Teléfono', attribute: 'telefono' },
  { name: 'Departamento', attribute: 'departamento' },
]

const PaginaEmpleados = () => {

  const {
    allEmpleados,
    refreshEmpleados,
    loading,
    deleteEmpleados,

  } = useEmpleados()

  const [listaEmpleados, setListaEmpleados] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const modalContainerRef = useRef()

  useEffect(() => {
    refreshEmpleados()
  }, [])

  useEffect(() => {
    setListaEmpleados(allEmpleados)
  }, [allEmpleados])

  const handleDeleteEmpleados = async () => {
    await deleteEmpleados(
      listaEmpleados
        .filter(e => e.isSelected)
        .map(e => e.idEmpleado)
    )
    handleCloseModal(setDeleteModalVisible)
    await refreshEmpleados()
  }

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

  return (
    <>
      {
        <CRUD
          title='Empleados'
          path='empleados'
          idName='idEmpleado'
          loading={loading}
          allElements={allEmpleados}
          elements={listaEmpleados}
          setElements={setListaEmpleados}
          columns={empleadosColumns}
          //onAdd={() => handleOpenModal(setFrmModalVisible)}
          //onEdit={handleEdit}
          onDelete={() => handleOpenModal(setDeleteModalVisible)}
        />
      }
      <div className='modal absolute pointer-events-none z-50 h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeleteEmpleados}
            elements={listaEmpleados}
            representation={['nombre']}
            message='Las siguientes fichas serán eliminadas de forma permanente'
          />
        }
      </div>
    </>
  )
}
export default PaginaEmpleados