import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import Loader from '../../components/Loader/Loader'
import { sleep } from '../../constants/functions'
import { useMateriales } from './hooks/useMateriales'


const PaginaMateriales = () => {
    const { allMateriales, loading, refreshMateriales, deleteMateriales} = useMateriales()
    const modalContainerRef = useRef()
    const [listaMateriales, setListaMateriales] = useState([])
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [saving, setSaving] = useState(false)

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
        modalContainerRef.current.classList.remove('visible')
        document.getElementById("tbl-page").classList.remove('blurred')
        await sleep(150)
        setState(false)
    }

    const handleDeleteMateriales = async () => {
        setSaving(true)
        await deleteMateriales(listaMateriales)
        await refreshMateriales()
        handleCloseModal(setDeleteModalVisible)
        setSaving(false)
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
                        onDelete={() => handleOpenModal(setDeleteModalVisible)}
                    />
            }
            <div className='modal absolute h-full w-full' ref={modalContainerRef}>
                {deleteModalVisible &&
                    <DeleteModal
                        onCancel={() => handleCloseModal(setDeleteModalVisible)}
                        onConfirm={handleDeleteMateriales}
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