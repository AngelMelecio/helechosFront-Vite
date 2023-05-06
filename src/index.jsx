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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <EmpleadosProvider>
            <MaquinasProvider>
              <ModelosProvider>
                <ProveedoresProvider>
                  <MaterialesProvider>
                    <FichasProvider>
                      <ClientesProvider>
                        <Main />
                      </ClientesProvider>
                    </FichasProvider>
                  </MaterialesProvider>
                </ProveedoresProvider>
              </ModelosProvider>
            </MaquinasProvider>
          </EmpleadosProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);