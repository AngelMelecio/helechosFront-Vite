import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import DeleteModal from '../../components/DeleteModal'
import CRUD from '../../components/CRUD'
import Loader from '../../components/Loader/Loader'
import { sleep } from '../../constants/functions'
import FrmClientes from '../../components/FrmClientes'
import { useClientes } from './hooks/useClientes'
const initobj = {
    idCliente: "",
    nombre: "",
    direccion: "",
    correo: "",
    contactos: [{ "nombre": "", "puesto": "", "correo": "", "telefono": "", "nota": "" }],
    otro: ""
}

const PaginaClientes = () => {


    const modalContainerRef = useRef()
    const { allClientes, loading, refreshClientes, deleteClientes} = useClientes()
    const [listaClientes, setListaClientes] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [objCliente, setObjCliente] = useState(initobj)
    const [saving, setSaving] = useState(false)

    const [frmModalVisible, setFrmModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

    useEffect(() => {
        refreshClientes()
    }, [])

    useEffect(() => {
        setListaClientes(allClientes)
    }, [allClientes])

    const handleOpenModal = async (setState) => {
        setState(true)
        await sleep(150)
        document.getElementById("tbl-page").classList.add('blurred')
        modalContainerRef.current.classList.add('visible')
    }
    const handleCloseModal = async (setState) => {
        setIsEdit(false)
        setObjCliente(initobj)
        modalContainerRef.current.classList.remove('visible')
        document.getElementById("tbl-page").classList.remove('blurred')
        await sleep(150)
        setState(false)
    }

    const handleDleteClientes = async () => {
        setSaving(true)
        await deleteClientes(listaClientes)
        await refreshClientes()
        handleCloseModal(setDeleteModalVisible)
        setSaving(false)
    }

    const handleEdit = async (cliente) => {
        setObjCliente(cliente)
        setIsEdit(true)
        handleOpenModal(setFrmModalVisible)
    }

    return (
        <>
            {
                loading ? <Loader /> :
                    <CRUD
                        title='Clientes'
                        idName='idCliente'
                        path='clientes'
                        loading={loading}
                        allElements={allClientes}
                        elements={listaClientes}
                        setElements={setListaClientes}
                        columns={[
                            { name: 'Nombre', attribute: 'nombre' },
                            { name: 'RFC', attribute: 'rfc' },
                            { name: 'Dirección', attribute: 'direccion' },
                            { name: 'Teléfono', attribute: 'telefono' },
                            { name: 'Correo', attribute: 'correo' },
                            { name: 'Otro', attribute: 'otro' },
                        ]}
                        onAdd={() => handleOpenModal(setFrmModalVisible)}
                        onEdit={handleEdit}
                        onDelete={() => handleOpenModal(setDeleteModalVisible)}
                    />
            }
            <div className='modal absolute pointer-events-none z-50 pointer-events-none z-50 h-full w-full' ref={modalContainerRef}>
                {frmModalVisible &&
                    <FrmClientes
                        onCloseModal={() => handleCloseModal(setFrmModalVisible)}
                        cliente={objCliente}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                    />

                }
                {deleteModalVisible &&
                    <DeleteModal
                        onCancel={() => handleCloseModal(setDeleteModalVisible)}
                        onConfirm={handleDleteClientes}
                        elements={listaClientes}
                        representation={['nombre', 'direccion', 'telefono', 'correo']}
                        message='Los siguientes clientes se eliminarán permanentemente:'
                    />
                }
            </div>
        </>
    )
}
export default PaginaClientes