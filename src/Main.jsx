import AppBar from "./components/AppBar"
import PaginaEmpleados from "./pages/Empleados/PaginaEmpleados"
import { Route, Routes, Navigate } from 'react-router-dom'
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
import PaginaPedidos from "./pages/Pedidos/PaginaPedidos"
import DetailPedido from "./pages/Pedidos/DetailPedido"
import PaginaProduccion from "./pages/Produccion/PaginaProduccion"
import PdfTest from "./pages/PdfTest"
import NuevoPedido from "./pages/Pedidos/NuevoPedido"
import TestComp from "./components/TestComp"

const getRoutesForRole = (role) => {
  const routesByRole = {
    'Administrador': [
      { path: "/usuarios", element: <PaginaUsuarios /> },
      { path: "/usuarios/:id", element: <DetailUsuario /> },
      { path: "/empleados", element: <PaginaEmpleados /> },
      { path: "/empleados/:id", element: <DetailEmpleado /> },
      { path: "/maquinas", element: <PaginaMaquinas /> },
      { path: "/maquinas/:id", element: <DetailMaquina /> },
      { path: "/modelos", element: <PaginaModelos /> },
      { path: "/modelos/:id", element: <DetailModelo /> },
      { path: "/materiales", element: <PaginaMateriales /> },
      { path: "/materiales/:id", element: <DetailMaterial /> },
      { path: "/clientes", element: <PaginaClientes /> },
      { path: "/clientes/:id", element: <DetailCliente /> },
      { path: "/proveedores", element: <PaginaProveedores /> },
      { path: "/proveedores/:id", element: <DetailProveedor /> },
      { path: "/pedidos", element: <PaginaPedidos /> },
      { path: "/pedidos/0", element: <NuevoPedido /> },
      { path: "/pedidos/:id", element: <DetailPedido /> },
      { path: "/produccion", element: <PaginaProduccion /> },
    ],
    'Desarrollador': [
      { path: "/modelos", element: <PaginaModelos /> },
      { path: "/modelos/:id", element: <DetailModelo /> },
    ],
    'Encargado': [
      { path: "/empleados", element: <PaginaEmpleados /> },
      { path: "/empleados/:id", element: <DetailEmpleado /> },
      { path: "/maquinas", element: <PaginaMaquinas /> },
      { path: "/maquinas/:id", element: <DetailMaquina /> },
      { path: "/modelos", element: <PaginaModelos /> },
      { path: "/modelos/:id", element: <DetailModelo /> },
      { path: "/materiales", element: <PaginaMateriales /> },
      { path: "/materiales/:id", element: <DetailMaterial /> },
      { path: "/clientes", element: <PaginaClientes /> },
      { path: "/clientes/:id", element: <DetailCliente /> },
      { path: "/proveedores", element: <PaginaProveedores /> },
      { path: "/proveedores/:id", element: <DetailProveedor /> },
      { path: "/pedidos", element: <PaginaPedidos /> },
      { path: "/pedidos/0", element: <NuevoPedido /> },
      { path: "/pedidos/:id", element: <DetailPedido /> },
      { path: "/produccion", element: <PaginaProduccion /> }
    ],
    'Produccion': [
      { path: "/produccion", element: <PaginaProduccion /> },
    ]
  };

  const routes = routesByRole[role] || [];
  //console.log(`Rutas para el rol ${role}:`, routes);
  return routes.map((route, index) => <Route key={`${role}-${index}`} path={route.path} element={route.element} />);
};

const Main = () => {

  const navigate = useNavigate()
  const { session } = useAuth()

  return (
    <>
      {session ?
        <>
          <AdminProvider>
            <div className="flex w-full h-screen overflow-hidden absolute bg-slate-100">
              <AppBar />
              {<Routes>
                <Route exact path="*" element={<Navigate replace to="/perfil" />} />
                <Route path="/perfil" element={<PaginaPerfil />} />
                {getRoutesForRole(session.usuario.rol)}
              </Routes>}
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
