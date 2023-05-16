import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import { sleep } from '../../constants/functions'
import { useProveedores } from './hooks/useProveedores'


const PaginaProveedores = () => {
    const { allProveedores, loading, refreshProveedores, deleteProveedores } = useProveedores()
    const modalContainerRef = useRef()
    const [listaProveedores, setListaProveedores] = useState([])
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        refreshProveedores()
    }, [])

    useEffect(() => {
        setListaProveedores(allProveedores)
    }, [allProveedores])

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

    const handleDeleteProveedores = async () => {
        setSaving(true)
        await deleteProveedores(listaProveedores)
        await refreshProveedores()
        handleCloseModal(setDeleteModalVisible)
        setSaving(false)
    }

    return (
        <>

            <CRUD
                title='Proveedores'
                idName='idProveedor'
                path='proveedores'
                loading={loading}
                allElements={allProveedores}
                elements={listaProveedores}
                setElements={setListaProveedores}
                columns={[
                    { name: 'Nombre', attribute: 'nombre' },
                    { name: 'RFC', attribute: 'rfc' },
                    { name: 'Dirección', attribute: 'direccion' },
                    { name: 'Teléfono', attribute: 'telefono' },
                    { name: 'Correo', attribute: 'correo' },
                    { name: 'Departamento', attribute: 'departamento' },
                    { name: 'Otro', attribute: 'otro' },
                ]}
                onDelete={() => handleOpenModal(setDeleteModalVisible)}
            />

            <div className='modal absolute h-full w-full' ref={modalContainerRef}>
                {deleteModalVisible &&
                    <DeleteModal
                        onCancel={() => handleCloseModal(setDeleteModalVisible)}
                        onConfirm={handleDeleteProveedores}
                        elements={listaProveedores}
                        representation={['nombre', 'rfc']}
                        message='Los siguientes proveedores se eliminarán permanentemente:'
                    />
                }
            </div>
        </>
    )
}
export default PaginaProveedores