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
      <div className="relative flex flex-col w-full h-full bg-slate-100">
        <div className="absolute flex flex-col w-full h-full p-4 overflow-hidden ">
          <h1 className="pb-4 pl-3 text-2xl font-bold text-teal-800/80">
            Mi perfil
          </h1>
          <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            <div className="flex flex-row items-center w-full px-10 pt-5">
              <ICONS.UsersIdentity className='mr-10 text-teal-800/80' size='95px' />
              <div className="text-xl font-semibold text-gray-700">
                {user[0].value} {user[1].value}
                <br />
                <p className="text-base italic font-medium text-gray-600">
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
                        className="h-12 font-medium text-gray-700 border-b-1">
                        <td className="px-3 text-sm font-medium pointer-events-none text-teal-800/80">
                          {atr.label}:
                        </td>
                        <td className="w-full font-semibold">
                          {
                            <p className="px-2 border-2 border-transparent">
                              {atr.value}
                            </p>
                          }
                        </td>
                        <td className="">
                          <div className="flex flex-row items-center justify-around w-24 h-full">
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