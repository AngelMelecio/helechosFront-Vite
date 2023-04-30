import { useNavigate, useParams } from 'react-router-dom';
import { ICONS } from '../../constants/icons';
import { useEffect, useRef } from 'react';
import useModelos from './hooks/useModelos';
import FrmModelos from './components/FrmModelos';
import { useState } from 'react';
import { useFichas } from './hooks/useFichas';
import Loader from '../../components/Loader/Loader';
import SectionFichas from './components/SectionFichas';
import { sleep } from '../../constants/sleep';
import FichasModal from '../../components/FichasModal';

let initModelo = {
  nombre: '',
  cliente: '',
}
const DetailModelo = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  const { allModelos } = useModelos()
  const { fichas, refreshFichas, loading: loadingFichas } = useFichas()

  const modelo = (id === '0' ? initModelo : allModelos.find(m => m.idModelo + '' === id))
  const isEdit = id !== '0'

  const modalRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)

  const [onSaveChanges, setOnSaveChanges] = useState( ()=>{} )
  const [onDiscardChanges, setOnDiscardChanges] = useState( ()=>{} )
  const [modalMessage, setModalMessage] = useState('')
  const [modalCancelText, setModalCancelText] = useState('')
  const [modalConfirmText, setModalConfirmText] = useState('')

  const handleOpenModal = async (setState) => {
    setState(true)
    await sleep(150)
    modalRef.current.classList.add('visible')
  }

  const handleCloseModal = async (setState) => {
    modalRef.current.classList.remove('visible')
    await sleep(150)
    setState(false)
  }

  const handleRefreshFichas = () => {
    refreshFichas({ idModelo: id })
  }

  useEffect(() => {
    console.log('DETALLES DEL MODELO:', id)
    handleRefreshFichas()
  }, [id])
  
  useEffect(()=>{
    console.log('EFECTO DETALLES MODELO')
  },[])

  return (
    <>
      <div className="w-full relative overflow-y-scroll h-full">
        <div id="tbl-page" className="flex flex-col w-full h-full bg-slate-100 relative px-8 py-5">
          <div className="flex pb-4 ">
            <button
              onClick={() => navigate(-1)}
              className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
            <p className="font-bold text-3xl pl-3 text-teal-700">
              {isEdit ? `Detalles del Modelo` : "Nuevo Modelo"}
            </p>
          </div>
          <div className="flex flex-col bg-white rounded-lg shadow-lg">
            <FrmModelos
              modelo={modelo ? modelo : initModelo}
              isEdit={id !== '0'}
            />
          </div>
          <p className="pt-8 pb-4 font-bold text-3xl pl-3 text-teal-700">
            Fichas Tecnicas
          </p>
          <div className="flex flex-col relative bg-white rounded-lg shadow-lg">
            {loadingFichas ? <Loader />
              :
              <SectionFichas
                fichas={fichas}
                openModal={ () => handleOpenModal(setModalVisible) }
                closeModal={ () => handleCloseModal(setModalVisible) }  
                setOnSaveChanges={setOnSaveChanges}
                setOnDiscardChanges={setOnDiscardChanges}
                setModalMessage={setModalMessage}
                setModalCancelText={setModalCancelText}
                setModalConfirmText={setModalConfirmText}
                refreshFichas={handleRefreshFichas}
              />
            }
          </div>
        </div>
      </div>
      <div className='modal absolute h-full w-full' ref={modalRef}>
        {modalVisible &&
          <FichasModal
            onCancel={onSaveChanges}
            onDelete={onDiscardChanges}
            cancelText={modalCancelText}
            deleteText={modalConfirmText}
            message={modalMessage}
          />
        }
      </div>
    </>
  )
}
export default DetailModelo