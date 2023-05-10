import { useEffect } from 'react'
import { useMaquinas } from './hooks/useMaquinas'
import { useState } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import Loader from '../../components/Loader/Loader'
import { useRef } from 'react'

const maquinasColumns = [
  { name: 'Número', attribute: 'numero' },
  { name: 'Línea', attribute: 'linea' },
  { name: 'Marca', attribute: 'marca' },
  { name: 'Modelo', attribute: 'modelo' },
  { name: 'Número de Serie', attribute: 'ns' },
  { name: 'Otros', attribute: 'otros' },
  { name: 'Fecha de Adquisición', attribute: 'fechaAdquisicion' },
  { name: 'Detalle Adquisición', attribute: 'detalleAdquisicion' },
  { name: 'Departamento', attribute: 'departamento' },
]

const PaginaMaquinas = () => {

  const {
    allMaquinas,
    loading,
    refreshMaquinas,
  } = useMaquinas()

  const modalContainerRef = useRef()

  const [listaMaquinas, setListaMaquinas] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(()=>{
    refreshMaquinas()
  },[])

  useEffect(()=>{
    setListaMaquinas(allMaquinas)
  },[allMaquinas])

  async function handleDelete(){
    console.log('TODO: eliminar maquinas')
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <CRUD
            title='Máquinas'
            path='maquinas'
            idName='idMaquina'
            loading={loading}
            allElements={allMaquinas}
            elements={listaMaquinas}
            setElements={setListaMaquinas}
            columns={maquinasColumns}
            //onAdd={() => handleOpenModal(setFrmModalVisible)}
            //onEdit={handleEdit}
            onDelete={() => handleOpenModal(setDeleteModalVisible)}
          />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDelete}
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