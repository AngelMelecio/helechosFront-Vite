import AppBar from "./components/AppBar"
import PaginaEmpleados from "./pages/Empleados/PaginaEmpleados"
import { Route, Routes, Navigate, Router } from 'react-router-dom'
import PaginaMaquinas from "./pages/Maquinas/PaginaMaquinas"
import PaginaClientes from "./pages/Clientes/PaginaClientes"
import Login from "./pages/Login"
import { useNavigate } from "react-router-dom"
import { AdminProvider } from "./context/AdminContext"
import PaginaUsuarios from "./pages/Usuarios/PaginaUsuarios"
import { useAuth } from "./context/AuthContext"
import PaginaPerfil from "./pages/PaginaPerfil"
import PaginaMateriales from "./pages/Materiales/PaginaMateriales"
import DetailMaterial from "./pages/Materiales/DetailMaterial"
import { ToastContainer } from "react-toastify"
import PaginaModelos from "./pages/Modelos/PaginaModelos"
import PaginaProveedores from "./pages/Proveedores/PaginaProveedores"
import DetailProveedor from "./pages/Proveedores/DetailProveedor"
import DetailEmpleado from "./pages/Empleados/DetailEmpleado"
import { EmpleadosProvider } from "./pages/Empleados/hooks/useEmpleados"
import DetailModelo from "./pages/Modelos/DetailModelo"
import DetailCliente from "./pages/Clientes/DetailCliente"
import DetailMaquina from "./pages/Maquinas/DetailMaquina"
import DetailUsuario from "./pages/Usuarios/DetailUsuario"

const Main = () => {

  const navigate = useNavigate()
  const { session } = useAuth()

  return (
    <>
      {session ?
        <>
          <AdminProvider>
            <div className="flex w-full h-screen overflow-hidden absolute">
              <AppBar />
              <Routes>
                <Route exact path="*" element={<Navigate replace to="/perfil" />} />
                <Route path="/perfil" element={<PaginaPerfil />} />
                {session.usuario.is_staff && 
                  <Route path="/usuarios" element={<PaginaUsuarios />} />}
                {session.usuario.is_staff && 
                  <Route path="/usuarios/:id" element={<DetailUsuario />} />}
                <Route path="/empleados" element={<PaginaEmpleados />} />
                <Route path="/empleados/:id" element={<DetailEmpleado />} />
                <Route path="/maquinas" element={<PaginaMaquinas />} />
                <Route path="/maquinas/:id" element={<DetailMaquina />} />
                <Route path="/modelos" element={<PaginaModelos />} />
                <Route path="/modelos/:id" element={<DetailModelo />} />
                <Route path="/materiales" element={<PaginaMateriales />} />
                <Route path="/materiales/:id" element={<DetailMaterial />} />
                <Route path="/clientes" element={<PaginaClientes />} />
                <Route path="/proveedores" element={<PaginaProveedores />} />
                <Route path="/proveedores/:id" element={<DetailProveedor />} />
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