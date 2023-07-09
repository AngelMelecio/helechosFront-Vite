import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import { useAdmin } from "../context/AdminContext"
import { useAuth } from "../context/AuthContext"
import AppBar from "../components/AppBar"



const PaginaPerfil = () => {

  const { session } = useAuth()
  const { updateUser } = useAdmin()


  const [user, setUser] = useState(() => {
    let u = session.usuario
    return [
      { id: 1, label: 'Nombre', value: u.nombre, atribute: 'nombre' },
      { id: 2, label: 'Apellidos', value: u.apellidos, atribute: 'apellidos' },
      { id: 3, label: 'Correo', value: u.correo, atribute: 'correo' },
      { id: 4, label: 'Usuario', value: u.usuario, atribute: 'usuario' },
    ]
  })

  useEffect(() => {
    let u = session.usuario
    setUser([
      { id: 1, label: 'Nombre', value: u.nombre, atribute: 'nombre' },
      { id: 2, label: 'Apellidos', value: u.apellidos, atribute: 'apellidos' },
      { id: 3, label: 'Correo', value: u.correo, atribute: 'correo' },
      { id: 4, label: 'Usuario', value: u.usuario, atribute: 'usuario' },
    ])
  }, [session,])

  const [tmpInp, setTmpInp] = useState('')
  const [focusedRow, setFocusedRow] = useState(null)

  const saveChanges = async (atribute) => {
    let sinId = {
      nombre: session.usuario.nombre,
      apellidos: session.usuario.apellidos,
      correo: session.usuario.correo,
      usuario: session.usuario.usuario,
      is_active: session.usuario.is_active,
      is_staff: session.usuario.is_staff,
    }
    let newV = { ...sinId, [atribute]: tmpInp }
    await updateUser(session.usuario.id, newV)
    setFocusedRow(0)
  }

  return (
    <>
      <div className="flex flex-col w-full h-full relative bg-slate-100">
        <div className=" flex flex-col h-full w-full absolute p-4 overflow-hidden">
          <h1 className="font-bold text-2xl pb-4 pl-3 text-teal-700">
            Mi perfil
          </h1>
          <div className="bg-white flex flex-col h-full rounded-lg shadow-lg">
            <div className="flex flex-row w-full items-center px-10 pt-5">
              <ICONS.UsersIdentity className='mr-5' size='110px' style={{ color: '#0f766e' }} />
              <div className="text-lg font-medium text-gray-700 italic">
                {user[0].value} {user[1].value}
                <br />
                <p className="text-base font-normal">
                  {session.usuario.rol}
                </p>
              </div>
            </div>
            <div className="w-full px-10 py-5">
              <table className="profile-table">
                <tbody>
                  {
                    user.map(atr =>
                      <tr
                        key={'A' + atr.id}
                        onClick={() => {
                          if (focusedRow !== atr.id) {
                            setFocusedRow(atr.id)
                            setTmpInp(atr.value)
                          }
                        }}
                        className="h-12 text-gray-700 border-b-1">
                        <td className="px-3 text-teal-700 font-medium text-sm pointer-events-none">
                          {atr.label}:
                        </td>
                        <td className="w-full  font-normal">
                          {
                            <p className="border-2 border-transparent px-2">
                              {atr.value}
                            </p>
                          }
                        </td>
                        <td className="">
                          <div className="flex flex-row h-full justify-around items-center w-24">
                          </div>
                        </td>
                      </tr>)
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaginaPerfil