import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import Loader from '../../components/Loader/Loader'
import { sleep } from '../../constants/functions'
import FrmProveedores from '../../components/FrmProveedores'
import { useProveedores } from './hooks/useProveedores'

const initobj = {
    idProveedor: "",
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    departamento: "Seleccione",
    contactos: [{ "nombre": "", "puesto": "", "correo": "", "telefono": "", "nota": "" }],
    otro: ""
}

const PaginaProveedores = () => {
    const modalContainerRef = useRef()
    const { allProveedores, loading, refreshProveedores, deleteProveedores } = useProveedores()
    const [listaProveedores, setListaProveedores] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [objProveedor, setObjProveedor] = useState(initobj);
    const [saving, setSaving] = useState(false)
    const [frmModalVisible, setFrmModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

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
        setIsEdit(false)
        setObjProveedor(initobj)
        modalContainerRef.current.classList.remove('visible')
        document.getElementById("tbl-page").classList.remove('blurred')
        await sleep(150)
        setState(false)
    }

    const handleDleteProveedores = async () => {
        setSaving(true)
        await deleteProveedores(listaProveedores)
        await refreshProveedores()
        handleCloseModal(setDeleteModalVisible)
        setSaving(false)
    }

    const handleEdit = async (proveedor) => {
        setObjProveedor(proveedor)
        setIsEdit(true)
        handleOpenModal(setFrmModalVisible)
    }

    return (
        <>
            {
                loading ? <Loader /> :
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
                        onAdd={() => handleOpenModal(setFrmModalVisible)}
                        onEdit={handleEdit}
                        onDelete={() => handleOpenModal(setDeleteModalVisible)}
                    />
            }
            <div className='modal absolute h-full w-full' ref={modalContainerRef}>
                {frmModalVisible &&
                    <FrmProveedores
                        onCloseModal={() => handleCloseModal(setFrmModalVisible)}
                        proveedor={objProveedor}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                    />

                }
                {deleteModalVisible &&
                    <DeleteModal
                        onCancel={() => handleCloseModal(setDeleteModalVisible)}
                        onConfirm={handleDleteProveedores}
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