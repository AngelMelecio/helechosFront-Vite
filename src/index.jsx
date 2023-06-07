import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import { AppProvider } from './context/AppContext';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { EmpleadosProvider } from './pages/Empleados/hooks/useEmpleados';
import { ModelosProvider } from './pages/Modelos/hooks/useModelos';
import { ClientesProvider } from './pages/Clientes/hooks/useClientes';
import { FichasProvider } from './pages/Modelos/hooks/useFichas';
import { MaquinasProvider } from './pages/Maquinas/hooks/useMaquinas';
import { MaterialesProvider } from './pages/Materiales/hooks/useMateriales';
import { ProveedoresProvider } from './pages/Proveedores/hooks/useProveedores';
import { UsuariosProvider } from './pages/Usuarios/hooks/useUsuarios';
import { FichaMaterialesProvider } from './pages/Modelos/hooks/useFichaMateriales'
import { DetailModelosProvider } from './pages/Modelos/hooks/useDetailModelos'
import { PedidosProvider } from './pages/Pedidos/hooks/usePedidos'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <EmpleadosProvider>
            <UsuariosProvider>
              <MaquinasProvider>
                <ModelosProvider>
                  <FichasProvider>
                    <FichaMaterialesProvider>
                      <DetailModelosProvider>
                        <ProveedoresProvider>
                          <MaterialesProvider>
                            <ClientesProvider>
                              <PedidosProvider>
                                <Main />
                              </PedidosProvider>
                            </ClientesProvider>
                          </MaterialesProvider>
                        </ProveedoresProvider>
                      </DetailModelosProvider>
                    </FichaMaterialesProvider>
                  </FichasProvider>
                </ModelosProvider>
              </MaquinasProvider>
            </UsuariosProvider>
          </EmpleadosProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);