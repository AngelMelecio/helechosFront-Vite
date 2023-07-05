import { useEffect } from 'react'
import { Link, resolvePath, useMatch, useResolvedPath } from 'react-router-dom'

import { ICONS } from '../constants/icons'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import helechos from '../imgs/helechos.png'

const AppBar = () => {

  const { Logout, session } = useAuth()
 
  const Tab = ({ to, Icon = null, content, ...props }) => {
    const resolvePath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvePath.pathname, end: false })
    let activeStyles = isActive ? `bg-teal-700 text-white hover:bg-teal-700` : `hover:bg-teal-500`
    return (
      <Link to={to}
        {...props}
        className={`text-white relative w-full h-10 flex flex-row items-center pl-2 py-3
            font-bold text-sm  duration-200 rounded-r-full
            cursor-pointer ` + activeStyles}>
        <p className='w-14 total-center'>
          {Icon && <Icon size='18px' />}
        </p>
        <p className='absolute ml-14 appbar-content whitespace-nowrap align-center flex'>
          {content}
        </p>
      </Link>
    )
  }

  const tabsByRole = {
    'Administrador': [
      { to: '/usuarios', content: 'Usuarios', Icon: ICONS.Admin },
      { to: '/empleados', content: 'Empleados', Icon: ICONS.Worker},
      { to: '/maquinas', content: 'Máquinas', Icon: ICONS.Machine},
      { to: '/modelos', content: 'Modelos', Icon: ICONS.Shoe},
      { to: '/clientes', content: 'Clientes', Icon: ICONS.HandShake},
      { to: '/proveedores', content: 'Proveedores', Icon: ICONS.Truck},
      { to: '/materiales', content: 'Materiales', Icon: ICONS.Thread},
      { to: '/pedidos', content: 'Pedidos', Icon: ICONS.Diablito},
    ],
    'Desarrollador': [
      { to: '/modelos', content: 'Modelos', Icon: ICONS.Shoe },
    ],
    'Encargado': [
      { to: '/empleados', content: 'Empleados', Icon: ICONS.Worker},
      { to: '/maquinas', content: 'Máquinas', Icon: ICONS.Machine},
      { to: '/modelos', content: 'Modelos', Icon: ICONS.Shoe},
      { to: '/clientes', content: 'Clientes', Icon: ICONS.HandShake},
      { to: '/proveedores', content: 'Proveedores', Icon: ICONS.Truck},
      { to: '/materiales', content: 'Materiales', Icon: ICONS.Thread},
      { to: '/pedidos', content: 'Pedidos', Icon: ICONS.Diablito},
    ],
    'Produccion':[
      { to: '/Produccion', content: 'Captura de Producción', Icon: ICONS.Qr }
    ]
  };

  const getTabsForRole = (role) => {
    const tabs = tabsByRole[role] || [];
    return tabs.map((tab, index) => <Tab key={`${role}-${index}`} to={tab.to} Icon={tab.Icon} content={tab.content} />);
  };

  return (
    <>
      <div id="appbar-container" className={`z-20 flex relative w-20 h-full`} >
        <div id='appbar' className='w-full h-full overflow-y-scroll overflow-x-hidden absolute ease-in-out bg-teal-600'>
          <div className='absolute flex flex-col justify-center w-full h-full'>
            <div className="appbar-content flex w-full justify-center mt-5 ">
              <img className="w-24 h-24" src={helechos} alt="" />
            </div>
            <div id="tabs" className="mt-10">
              <Tab to={'/perfil'} content={'Perfil'} Icon={ICONS.Profile} />
              {getTabsForRole(session.usuario.rol)}
            </div>
            <div className='flex h-full items-end w-full pb-10'>
              <Tab
                onClick={Logout}
                to={'/login'}
                content={'Salir'}
                Icon={ICONS.Logout} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppBar
