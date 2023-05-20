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
    let activeStyles = isActive ? `bg-teal-700 hover:bg-teal-700` : `hover:bg-teal-500`
    return (
      <Link to={to}
        {...props}
        className={`text-white relative w-full flex flex-row py-3
            font-bold text-sm  duration-200 rounded-lg
            items-center cursor-pointer my-2 ` + activeStyles}>
        <p className='w-14 total-center'>
          {Icon && <Icon size='20px' />}
        </p>
        <p className='absolute ml-14 appbar-content align-center flex'>
          {content}
        </p>
      </Link>
    )
  }

  const tabsByRole = {
    'Administrador': [
      { to: '/usuarios', content: 'USUARIOS', Icon: ICONS.Admin },
      { to: '/empleados', content: 'EMPLEADOS', Icon: ICONS.Worker},
      { to: '/maquinas', content: 'MAQUINAS', Icon: ICONS.Machine},
      { to: '/modelos', content: 'MODELOS', Icon: ICONS.Shoe},
      { to: '/clientes', content: 'CLIENTES', Icon: ICONS.HandShake},
      { to: '/proveedores', content: 'PROVEEDORES', Icon: ICONS.Truck},
      { to: '/materiales', content: 'MATERIALES', Icon: ICONS.Worker},
    ],
    'Desarrollador': [
      { to: '/modelos', content: 'MODELOS', Icon: ICONS.Shoe },
    ],
    'Encargado': [
      { to: '/empleados', content: 'EMPLEADOS', Icon: ICONS.Worker},
      { to: '/maquinas', content: 'MAQUINAS', Icon: ICONS.Machine},
      { to: '/modelos', content: 'MODELOS', Icon: ICONS.Shoe},
      { to: '/clientes', content: 'CLIENTES', Icon: ICONS.HandShake},
      { to: '/proveedores', content: 'PROVEEDORES', Icon: ICONS.Truck},
      { to: '/materiales', content: 'MATERIALES', Icon: ICONS.Worker},
    ],
  };

  const getTabsForRole = (role) => {
    const tabs = tabsByRole[role] || [];
    return tabs.map((tab, index) => <Tab key={`${role}-${index}`} to={tab.to} Icon={tab.Icon} content={tab.content} />);
  };

  return (
    <>
      <div id="appbar-container" className={`z-20 flex relative w-20 h-screen`} >
        <div id='appbar' className='w-full h-full overflow-y-scroll overflow-x-hidden absolute ease-in-out bg-teal-600'>
          <div className='absolute flex pl-2 flex-col justify-center w-full h-full'>
            <div className="appbar-content flex w-full justify-center mt-5 ">
              <img className="w-24 h-24" src={helechos} alt="" />
            </div>
            <div id="tabs" className="mt-10">
              <Tab to={'/perfil'} content={'PERFIL'} Icon={ICONS.Profile} />
              {getTabsForRole(session.usuario.rol)}
            </div>
            <div className='flex h-full items-end w-full pb-10'>
              <Tab
                onClick={Logout}
                to={'/login'}
                content={'SALIR'}
                Icon={ICONS.Logout} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AppBar
