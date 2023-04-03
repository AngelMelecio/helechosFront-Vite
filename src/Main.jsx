import AppBar from "./components/AppBar"
import PaginaEmpleados from "./pages/PaginaEmpleados"
import { Route, Routes, Navigate } from 'react-router-dom'
import PaginaMaquinas from "./pages/PaginaMaquinas"
import PaginaClientes from "./pages/PaginaClientes"
import Login from "./pages/Login"
import { useNavigate } from "react-router-dom"
import { AdminProvider } from "./context/AdminContext"
import PaginaUsuarios from "./pages/PaginaUsuarios"
import { useAuth } from "./context/AuthContext"
import PaginaPerfil from "./pages/PaginaPerfil"
import { ToastContainer } from "react-toastify"
import PaginaModelos from "./pages/PaginaModelos"
import PaginaProveedores from "./pages/PaginaProveedores"
import FichaTecnicaPrint from "./components/FichaTecnicaPrint"

const Main = () => {

  const navigate = useNavigate()
  const { session } = useAuth()


  return (
    <div className="flex w-screen relative h-screen overflow-hidden  ">
      {session ?
        <>
          <AdminProvider>
            <div className="flex w-18 realtive overflow-hidden">
              <AppBar />
            </div>
            <div id='page' className="flex w-full h-screen relative">
              <div className="flex absolute w-full h-full ">
                <Routes>
                  <Route exact path="*" element={<Navigate replace to="/perfil" />} />
                  <Route path="/perfil" element={<PaginaPerfil />} />
                  {session.usuario.is_staff && <Route path="/usuarios" element={<PaginaUsuarios />} />}
                  <Route path="/empleados" element={<PaginaEmpleados />} />
                  <Route path="/maquinas" element={<PaginaMaquinas />} />
                  <Route path="/modelos" element={<PaginaModelos />} />
                  <Route path="/proveedores" element={<PaginaProveedores />} />
                  
                  <Route path="/clientes" element={<PaginaClientes />} />
                </Routes>
              </div>
            </div>
          </AdminProvider>
        </>
        :
        <>
          <Routes>
            <Route exact path="*" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login navigate={navigate} />} />
          </Routes>
        </>
      }
    </div>

  )
}
export default Main