import AppBar from "./components/AppBar"
import PaginaEmpleados from "./pages/Empleados/PaginaEmpleados"
import { Route, Routes, Navigate, Router } from 'react-router-dom'
import PaginaMaquinas from "./pages/PaginaMaquinas"
import PaginaClientes from "./pages/Clientes/PaginaClientes"
import Login from "./pages/Login"
import { useNavigate } from "react-router-dom"
import { AdminProvider } from "./context/AdminContext"
import PaginaUsuarios from "./pages/PaginaUsuarios"
import { useAuth } from "./context/AuthContext"
import PaginaPerfil from "./pages/PaginaPerfil"
import PaginaMateriales from "./pages/PaginaMateriales"
import { ToastContainer } from "react-toastify"
import PaginaModelos from "./pages/Modelos/PaginaModelos"
import PaginaProveedores from "./pages/PaginaProveedores"
import FichaTecnicaPrint from "./components/FichaTecnicaPrint"
import DetailEmpleado from "./pages/Empleados/DetailEmpleado"
import { EmpleadosProvider } from "./pages/Empleados/hooks/useEmpleados"
import DetailModelo from "./pages/Modelos/DetailModelo"
import DetailCliente from "./pages/Clientes/DetailCliente"

const Main = () => {

  const navigate = useNavigate()
  const { session } = useAuth()

  return (
    <>
      {session ?
        <>
          <AdminProvider>
            <div className="flex w-full h-screen">
              <AppBar />
              <Routes>
                <Route exact path="*" element={<Navigate replace to="/perfil" />} />
                <Route path="/perfil" element={<PaginaPerfil />} />
                {session.usuario.is_staff && <Route path="/usuarios" element={<PaginaUsuarios />} />}
                <Route path="/empleados" element={<PaginaEmpleados />} />
                <Route path="/empleados/:id" element={<DetailEmpleado />} />
                <Route path="/maquinas" element={<PaginaMaquinas />} />
                <Route path="/modelos" element={<PaginaModelos />} />
                <Route path="/modelos/:id" element={<DetailModelo />} />
                <Route path="/proveedores" element={<PaginaProveedores />} />
                <Route path="/Materiales" element={<PaginaMateriales />} />
                <Route path="/clientes" element={<PaginaClientes />} />
                <Route path="/clientes/:id" element={<DetailCliente />} />
              </Routes>
            </div>
          </AdminProvider>
        </>
        : // Si no hay session
        <>
          <Routes>
            <Route exact path="*" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Login navigate={navigate} />} />
          </Routes>
        </>
      }
    </>

  )
}
export default Main