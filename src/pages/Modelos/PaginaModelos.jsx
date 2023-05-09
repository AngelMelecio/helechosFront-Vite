import { useRef } from "react"
import useModelos from "./hooks/useModelos"
import { useState } from "react"
import { useEffect } from "react"
import CRUD from "../../components/CRUD"
import { sleep } from "../../constants/functions"
import DeleteModal from "../../components/DeleteModal"

const initModeloObj = {
  idModelo: '',
  nombre: '',
  idCliente: 'Seleccione',
}

const initFichaTecnicaObj = {
  modelo: '',
  nombre: '',
  archivoPrograma: null,
  fotografia: null,
  talla: '',

  maquinaTejido: '',
  tipoMaquinaTejido: '',
  galga: '',
  velocidadTejido: '',
  tiempoBajada: '',

  maquinaPlancha: '',
  velocidadPlancha: '',
  temperaturaPlancha: '',

  pesoPoliester: 0,
  pesoMelt: 0,
  pesoLurex: 0,

  materiales: [],
  numeroPuntos: [{ valor: '', posicion: '' }],
  jalones: [{ valor: '', posicion: '' }],
  economisadores: [{ valor: '', posicion: '' }],
  otros: '',

  idMaquinaTejido: 'Seleccione',
  nombreMaquinaTejido: '',

  idMaquinaPlancha: 'Seleccione',
  nombreMaquinaPlancha: ''
}

const PaginaModelos = () => {
  const modalContainerRef = useRef()
  const { allModelos, loading, refreshModelos, deleteModelos } = useModelos()
  const [listaModelos, setListaModelos] = useState([])
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    refreshModelos()
  }, [])

  useEffect(() => {
    setListaModelos(allModelos)
  }, [allModelos])

  async function handleDelete(){
    await deleteModelos(
      listaModelos
      .filter(m => m.isSelected)
      .map(m => m.idModelo)
    )
    handleCloseModal( setDeleteModalVisible )
    refreshModelos()
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
          title='Modelos'
          idName="idModelo"
          path='modelos'
          loading={loading}
          allElements={allModelos}
          elements={listaModelos}
          setElements={setListaModelos}
          columns={[{ name: 'Nombre', attribute: 'nombre' }]}
          onDelete={() => handleOpenModal(setDeleteModalVisible)}
        />
      }
      <div className='modal absolute h-full w-full' ref={modalContainerRef}>

        {deleteModalVisible &&
          <DeleteModal
            onCancel={() => handleCloseModal(setDeleteModalVisible)}
            onConfirm={ handleDelete}
            elements={listaModelos}
            representation={['nombre']}
            message='Las siguientes fichas serán eliminadas de forma permanente'
          />
        }

      </div>
    </>
  )
}
export default PaginaModelos