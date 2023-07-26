import { useEffect } from 'react'
import { useMaquinas } from './hooks/useMaquinas'
import { useState } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import { useRef } from 'react'
import { sleep } from '../../constants/functions'


const maquinasColumns = [
  { name: 'Número', attribute: 'numero' },
  { name: 'Línea', attribute: 'linea' },
  { name: 'Marca', attribute: 'marca' },
  { name: 'Modelo', attribute: 'modelo' },
  { name: 'Número de Serie', attribute: 'ns' },
  { name: 'Otros', attribute: 'otros' },
  { name: 'Fecha de Adquisición', attribute: 'fechaAdquisicion', type: 'date' },
  { name: 'Detalle Adquisición', attribute: 'detalleAdquisicion' },
  { name: 'Departamento', attribute: 'departamento' },
]

const PaginaMaquinas = () => {

  const { allMaquinas, loading, refreshMaquinas, deleteMaquinas } = useMaquinas()

  const modalContainerRef = useRef()
  const [listaMaquinas, setListaMaquinas] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [saving, setSaving] = useState(false)


  useEffect(() => {
    refreshMaquinas()
  }, [])

  useEffect(() => {
    setListaMaquinas(allMaquinas)
  }, [allMaquinas])

  const handleDeleteMaquinas = async () => {
    setSaving(true)
    await deleteMaquinas(listaMaquinas)
    await refreshMaquinas()
    handleCloseModal(setDeleteModalVisible)
    setSaving(false)
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

    
      <CRUD
        title='Máquinas'
        path='maquinas'
        idName='idMaquina'
        loading={loading}
        allElements={allMaquinas}
        elements={listaMaquinas}
        setElements={setListaMaquinas}
        columns={maquinasColumns}
        onDelete={() => handleOpenModal(setDeleteModalVisible)}
      />
    
      <div className='modal absolute z-50 h-full w-full' ref={modalContainerRef}>
        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={handleDeleteMaquinas}
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