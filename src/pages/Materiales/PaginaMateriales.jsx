import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import Loader from '../../components/Loader/Loader'
import { sleep } from '../../constants/functions'
import FrmMateriales from '../../components/FrmMateriales'
import { useMateriales } from './hooks/useMateriales'

const initobj = {
    idMaterial: "",
    tipo: "Seleccione",
    color: "",
    calibre: "Seleccione",
    proveedor: "Seleccione",
    tenida: "",
    codigoColor: "#ffffff",
    idProveedor: "Seleccione",
    nombreProveedor: ""
  }

const PaginaMateriales = () => {


    const modalContainerRef = useRef()
    const { allMateriales, loading, refreshMateriales, deleteMateriales} = useMateriales()
    const [listaMateriales, setListaMateriales] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [objMaterial, setObjMaterial] = useState(initobj)
    const [saving, setSaving] = useState(false)
    const [frmModalVisible, setFrmModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

    useEffect(() => {
        refreshMateriales()
    }, [])

    useEffect(() => {
        setListaMateriales(allMateriales)
    }, [allMateriales])

    const handleOpenModal = async (setState) => {
        setState(true)
        await sleep(150)
        document.getElementById("tbl-page").classList.add('blurred')
        modalContainerRef.current.classList.add('visible')
    }
    const handleCloseModal = async (setState) => {
        setIsEdit(false)
        setObjMaterial(initobj)
        modalContainerRef.current.classList.remove('visible')
        document.getElementById("tbl-page").classList.remove('blurred')
        await sleep(150)
        setState(false)
    }

    const handleDleteMateriales = async () => {
        setSaving(true)
        await deleteMateriales(listaMateriales)
        await refreshMateriales()
        handleCloseModal(setDeleteModalVisible)
        setSaving(false)
    }

    const handleEdit = async (material) => {
        setObjMaterial(material)
        setIsEdit(true)
        handleOpenModal(setFrmModalVisible)
    }

    return (
        <>
            {
                loading ? <Loader /> :
                    <CRUD
                        title='Materiales'
                        idName='idMaterial'
                        path='materiales'
                        loading={loading}
                        allElements={allMateriales}
                        elements={listaMateriales}
                        setElements={setListaMateriales}
                        columns={[
                            { name: 'Tipo', attribute: 'tipo' },
                            { name: 'Color', attribute: 'color' },
                            { name: 'Calibre', attribute: 'calibre' },
                            { name: 'Proveedor', attribute: 'nombreProveedor' },
                            { name: 'Teñida / Calidad', attribute: 'tenida' },
                            { name: 'Código de color', attribute: 'codigoColor' },
                          ]}
                        onAdd={() => handleOpenModal(setFrmModalVisible)}
                        onEdit={handleEdit}
                        onDelete={() => handleOpenModal(setDeleteModalVisible)}
                    />
            }
            <div className='modal absolute pointer-events-none z-50 h-full w-full' ref={modalContainerRef}>
                {frmModalVisible &&
                    <FrmMateriales
                        onCloseModal={() => handleCloseModal(setFrmModalVisible)}
                        material={objMaterial}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                    />

                }
                {deleteModalVisible &&
                    <DeleteModal
                        onCancel={() => handleCloseModal(setDeleteModalVisible)}
                        onConfirm={handleDleteMateriales}
                        elements={listaMateriales}
                        representation={['color', 'tenida']}
                        message='Los siguientes materiales se eliminarán permanentemente:'
                    />
                }
            </div>
        </>
    )
}
export default PaginaMateriales