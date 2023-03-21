import { useEffect, useState } from "react"
import { ICONS } from "../constants/icons"
import { useAdmin } from "../context/AdminContext"
import { useAuth } from "../context/AuthContext"



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
    <div className="flex flex-col w-full bg-gray-200">
      <div className="shadow-xl h-screen  bg-white py-5">
        <div className="flex flex-row w-full h-1/5 items-center px-5">
          <ICONS.UsersIdentity className='mr-5' size='110px' style={{ color: '#115e59' }} />
          <div className="text-lg font-medium text-gray-700 italic">
            {user[0].value} {user[1].value} 
            <br />
            <p className="text-base font-normal">
              { session.usuario.is_staff ? 'Administrador': 'Encargado'}
            </p>
          </div>
        </div>
        <div className="w-full p-5">
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
                    <td className="px-3 text-gray-900 font-medium text-sm pointer-events-none">
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
                        {/*focusedRow === atr.id ?
                          <>
                            <button
                              onClick={() => saveChanges(atr.atribute)}
                              className="normal-button w-full flex items-center p-1 rounded-md justify-center" >
                              <ICONS.Save size='20px' />
                            </button>
                            <button
                              className="neutral-button w-full flex items-center p-1 rounded-md justify-center "
                              onClick={() => setFocusedRow(0)}>
                              <ICONS.Cancel size="20px" />
                            </button>
                          </>
                          :
                          <button className="filter-button">
                            <ICONS.Edit size='20px' />
                    </button>*/}
                      </div>
                    </td>
                  </tr>)
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PaginaPerfil