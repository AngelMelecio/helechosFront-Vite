import { useEffect, useState } from "react"
import { ICONS } from "../../../constants/icons"
import { useFichas } from "../hooks/useFichas"
import FrmFichas from "./FrmFichas"
import { useParams } from "react-router-dom"
import { useFichaMateriales } from "../hooks/useFichaMateriales"
import { useDetailModelos } from "../hooks/useDetailModelos"

const initFichaObj = {
  modelo: '',
  nombre: '',
  nombrePrograma: '',
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

const SectionFichas = ({
  openModal,
  closeModal,
  setOnSaveChanges,
  setOnDiscardChanges,
  setModalMessage,
  setModalCancelText,
  setModalConfirmText,
  
}) => {

  const { id } = useParams();

  const [fichasList, setFichasList] = useState([])
  //const [selectedFichaIndx, setSelectedFichaIndx] = useState(null)
  //const [theresChanges, setTheresChanges] = useState(false)

  const {
    allFichasModelo,
    refreshFichas,
    setFetchingFichas,
    deleteFicha : deleteFichaAPI,
    fetchingFichas
  } = useFichas()
  
  const{
    selectedFichaIndx,
    setSelectedFichaIndx,
    theresChangesFicha,setTheresChangesFicha,
    theresChangesMateriales,setTheresChangesMateriales
  } = useDetailModelos()
  
  const {
    allFichaMateriales,
  } = useFichaMateriales()

  const handleSelectFicha = (indx) => {
    if (indx === selectedFichaIndx) return
    if (theresChangesFicha || theresChangesMateriales) {
      setModalMessage('Hay cambios sin guardar, ¿Desea descartarlos?')
      setModalCancelText('Permanecer')
      setModalConfirmText('Descartar')
      setOnDiscardChanges(() => () => {
        closeModal()
        setSelectedFichaIndx(indx)
        setTheresChangesFicha(false)
        setTheresChangesMateriales(false)
      })
      setOnSaveChanges(() => () => {
        closeModal()
      })
      openModal()
      return
    }
    setSelectedFichaIndx(indx)
    setTheresChangesFicha(false)
    setTheresChangesMateriales(false)
  }

  const handleAddFicha = () => {
    if (theresChangesFicha || theresChangesMateriales) {
      setModalMessage('Hay cambios sin guardar, ¿Desea descartarlos?')
      setModalCancelText('Permanecer')
      setModalConfirmText('Descartar')
      setOnDiscardChanges(() => () => {
        addFicha()
        closeModal()
        setTheresChangesFicha(false)
        setTheresChangesMateriales(false)
      })
      setOnSaveChanges(() => () => {
        closeModal()
      })
      openModal()
      return
    }
    addFicha()
  }

  const addFicha = () => {
    setSelectedFichaIndx(fichasList?.length)
    if (fichasList.length === 0) {
      setFichasList([initFichaObj])
    }
    else
      setFichasList(prev => ([
        ...prev,
        { ...initFichaObj }
      ]))
  }

  const handleDeleteFicha = (indx) => {
    if (theresChangesFicha || fichasList[indx].idFichaTecnica || theresChangesMateriales ) {
      setModalMessage('Se eliminará la ficha técnica de forma permanente')
      setModalCancelText('Cancelar')
      setModalConfirmText('Eliminar')
      setOnSaveChanges(() => () => closeModal())
      setOnDiscardChanges(() => () => {
        deleteFicha(indx)
        closeModal()
        setTheresChangesFicha(false)
        setTheresChangesMateriales(false)
      })
      openModal()
    }
    else
      deleteFicha(indx)
  }

  const deleteFicha = async(indx) => {
    if (fichasList[indx].idFichaTecnica) {
      await deleteFichaAPI(fichasList[indx].idFichaTecnica)
      refreshFichas({ idModelo:fichasList[indx].modelo })
    }
    else {
      let newFichas = [...fichasList]
      newFichas.splice(indx, 1)
      setFichasList(newFichas)
    }
    setSelectedFichaIndx(null)
  }

  useEffect(() => {
    setFichasList(allFichasModelo)
    /*return () => { 
      setFetchingFichas(true) 
      setSelectedFichaIndx(null)
    }*/
  }, [allFichasModelo])

  const handleCopyFicha = async (indx) => {
    setFichasList(prev => [
      ...prev,
      {
        ...prev[indx],
        nombre: prev[indx].nombre + ' Copia',
        idFichaTecnica: undefined,
        fechaCreacion:'',
        fechaUltimaEdicion:'',
        fotografia:'',
        archivoPrograma: null,
        materiales: allFichaMateriales,
        copied: true
      }
    ])
    setSelectedFichaIndx(fichasList.length)
  }

  return (
    <div id="frm-ficha" className="flex w-full relative h-full">
      {/* Fichas Side Bar */}
      <div className="h-full w-80 bg-gray-50">
        <div className="flex flex-col w-full h-full overflow-hidden">
          <div className="p-3 pr-6">
            <button
              disabled={id==='0'}
              onClick={handleAddFicha}
              className="flex items-center duration-200 border-gray-300 text-teal-800/80 border rounded-sm w-full p-3 hover:border-teal-500  disabled:border-gray-300 disabled:text-gray-400">
              <ICONS.Plus></ICONS.Plus>
              <p className="ml-2 font-semibold">Nueva Ficha</p>
            </button>
          </div>
          <div className="flex w-full h-full relative overflow-y-scroll">
            <div className="w-full absolute flex">
              <div className="flex flex-col w-full h-full px-3 pb-3">
                {fichasList?.map((ficha, indx) =>
                  <div key={'Fich' + indx}
                    type="button"
                    onClick={() => handleSelectFicha(indx)}
                    className={"rounded-sm my-1 flex w-full p-3 items-center relative cursor-pointer" + (indx === selectedFichaIndx ? " bg-white shadow-md text-teal-800/80" : " hover:bg-gray-200 text-gray-600 duration-200")}
                  >
                    <p className="font-medium">{ficha.nombre !== '' ? ficha.nombre : 'Nueva Ficha'}</p>
                    {indx === selectedFichaIndx && // Botones de eliminar y copiar
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteFicha(indx)
                          }}
                          type="button"
                          className="  w-6 h-6 trash-button rounded-md total-center absolute right-8"> <ICONS.Trash /> </button>
                        <button
                          disabled={!ficha.idFichaTecnica || theresChangesFicha}
                          onClick={e => {
                            e.stopPropagation();
                            handleCopyFicha(indx)
                          }}
                          type="button"
                          className="  w-6 h-6 normal-button rounded-md total-center absolute right-1"> <ICONS.Copy /> </button>
                      </>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Formulario Fichas */
        selectedFichaIndx !== null && !fetchingFichas && fichasList[selectedFichaIndx] ?
            <FrmFichas
            ficha={fichasList[selectedFichaIndx]}
          />
          :
          <div className="flex justify-center items-center w-full total-center bg-gray-200 h-full">
            <p className="italic font-semibold text-gray-600 ">
              {
                id === '0' ? <>Guarde un modelo antes de crear fichas...</> : <>Selecciona o crea una ficha ...</>
              }
            </p>
          </div>
      }
    </div>
  )
}
export default SectionFichas