import { useNavigate, useParams } from 'react-router-dom';
import { ICONS } from '../../constants/icons';
import { useEffect, useRef } from 'react';
import useModelos from './hooks/useModelos';
import FrmModelos from './components/FrmModelos';
import { useState } from 'react';
import { useFichas } from './hooks/useFichas';
import Loader from '../../components/Loader/Loader';
import SectionFichas from './components/SectionFichas';
import { sleep } from '../../constants/functions';
import FichasModal from '../../components/FichasModal';
import FichaTecnicaPrint from './components/FichaTecnicaPrint';
import { useDetailModelos } from './hooks/useDetailModelos';
import { useFichaMateriales } from './hooks/useFichaMateriales';
import { useMaquinas } from '../Maquinas/hooks/useMaquinas';

let initModelo = {
  nombre: '',
  cliente: '',
}
const DetailModelo = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = id !== '0'

  const modalRef = useRef()

  const [modelo, setModelo] = useState(null)
  const { getModelo, fetchingOneModelo } = useModelos()
  const { allFichasModelo, refreshFichas, fetchingFichas } = useFichas()

  const [modalVisible, setModalVisible] = useState(false)
  const [printModalVisible, setPrintModalVisible] = useState(false)

  const [onSaveChanges, setOnSaveChanges] = useState(() => { })
  const [onDiscardChanges, setOnDiscardChanges] = useState(() => { })
  const [modalMessage, setModalMessage] = useState('')
  const [modalCancelText, setModalCancelText] = useState('')
  const [modalConfirmText, setModalConfirmText] = useState('')

  const {
    allMaquinas
  } = useMaquinas()

  const {
    disablePrint,
    selectedFichaIndx,
    theresChangesModelo, setTheresChangesModelo,
    theresChangesFicha, setTheresChangesFicha,
    setPageScrollBottom
  } = useDetailModelos()

  const {
    allFichaMateriales,
  } = useFichaMateriales()

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

  useEffect(()=>{
    return () => {
      setTheresChangesModelo(false)
      setTheresChangesFicha(false)
    }
  },[])

  useEffect(async () => {
    console.log('EFFECTO\n DETALLE MODELO, id:', id)
    refreshFichas({ idModelo: id })
    const mod = (id === '0' ? initModelo : await getModelo(id))
    setModelo(mod)
  }, [id])

  const pageRef = useRef()

  const handleScroll = () => {
    setPageScrollBottom(
      Math.ceil(pageRef.current.scrollTop + pageRef.current.clientHeight) >=
      pageRef.current.scrollHeight
    )
  }

  return (
    <>
      <div
        ref={pageRef}
        onScroll={handleScroll}
        className="w-full relative overflow-y-scroll h-full">
        <div id="tbl-page" className="flex flex-col w-full bg-slate-100 relative px-8 py-5">
          {/**
           * HEADER
           */}
          <div className="flex pb-4 justify-between">
            <div className="flex">
              <button
                onClick={() => navigate('/modelos')}
                className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
              <p className="font-bold text-3xl pl-3 text-teal-700">
                {isEdit ? `Detalles del Modelo` : "Nuevo Modelo"}
              </p>
            </div>
            <div>
              <input
                disabled={fetchingOneModelo || !theresChangesModelo}
                className='bg-teal-500 h-10 p-1 w-40 text-white normal-button  z-10  rounded-lg'
                type="submit"
                value={isEdit ? "Guardar Modelo" : "Crear Modelo"}
                form="frmModelos"
              />
            </div>
          </div>
          {/**
           * FORM MODELOS
           */}
          <div className="flex flex-col bg-white rounded-lg shadow-lg">
            {fetchingOneModelo || modelo === null ? <Loader /> :
              <FrmModelos
                modelo={modelo !== null ? modelo : initModelo}
                isEdit={isEdit}
              />}
          </div>
          {/**
           * SECCION FICHAS
           */}
          <div className='flex flex-col screen'>
            <div className="pt-12 pb-4 flex w-full justify-between items-center">
              <p className=" font-bold text-3xl pl-3 text-teal-700">
                Fichas Tecnicas
              </p>
              <div className='flex'>
                <button
                  onClick={() => handleOpenModal(setPrintModalVisible)}
                  disabled={disablePrint}
                  className='normal-button h-10 w-10 rounded-lg total-center mr-4'
                >
                  <ICONS.Print size='25px' />
                </button>
                {<input
                  disabled={fetchingFichas || !theresChangesFicha}
                  className='bg-teal-500 h-10 p-1 w-40 text-white normal-button z-10 rounded-lg'
                  type="submit"
                  value={"Guardar Ficha"}
                  form="frmFichas"
                />}
              </div>
            </div>
            <div className="flex flex-col relative h-full bg-white rounded-lg shadow-lg">
              {fetchingFichas ? <Loader />
                :
                <SectionFichas
                  openModal={() => handleOpenModal(setModalVisible)}
                  closeModal={() => handleCloseModal(setModalVisible)}
                  setOnSaveChanges={setOnSaveChanges}
                  setOnDiscardChanges={setOnDiscardChanges}
                  setModalMessage={setModalMessage}
                  setModalCancelText={setModalCancelText}
                  setModalConfirmText={setModalConfirmText}
                />
              }
            </div>
          </div>
        </div>
      </div>
      {/**
       * MODALES
       */}
      <div className='modal absolute pointer-events-none z-50 h-full w-full' ref={modalRef}>
        {modalVisible &&
          <FichasModal
            onCancel={onSaveChanges}
            onDelete={onDiscardChanges}
            cancelText={modalCancelText}
            deleteText={modalConfirmText}
            message={modalMessage}
          />
        }
        {printModalVisible &&
          <FichaTecnicaPrint
            data={[
              {
                ...allFichasModelo[selectedFichaIndx],
                materiales: allFichaMateriales,
                modelo: modelo,
                cliente: modelo.cliente,
                maquinaTejido: allMaquinas.find( m => m.idMaquina + '' === allFichasModelo[selectedFichaIndx].maquinaTejido ),
                maquinaPlancha: allMaquinas.find( m => m.idMaquina + '' === allFichasModelo[selectedFichaIndx].maquinaPlancha )
              }
            ]}
            onCloseModal={() => handleCloseModal(setPrintModalVisible)}
          />
        }
      </div>
    </>
  )
}
export default DetailModelo