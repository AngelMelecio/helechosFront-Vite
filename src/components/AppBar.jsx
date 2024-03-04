import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { ICONS } from '../constants/icons'
import { useAuth } from '../context/AuthContext'
import helechos from '../imgs/helechos.png'

const AppBar = () => {

  const { Logout, session } = useAuth()

  const { rol } = session.usuario

  const Tab = ({ tab, to, Icon = null, content, ...props }) => {
    const resolvePath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvePath.pathname, end: false })
    let activeStyles = isActive ? `bg-teal-200/20 text-white hover:bg-teal-200/20 ` : `hover:bg-slate-400/20`
    return (
      <Link to={to}
        {...props}
        className={`text-white relative w-full mx-2 h-10 flex flex-row items-center  rounded-l-full
            font-bold text-sm  duration-200 
            cursor-pointer ` + activeStyles}>
        <p className='w-12 total-center'>
          {Icon}
        </p>
        <p className='absolute flex ml-14 appbar-content whitespace-nowrap align-center'>
          {content}
        </p>
      </Link>
    )
  }

  const tabsByRole = {
    'Administrador': [
      { to: '/usuarios', content: 'Usuarios', Icon: <ICONS.Admin size="20px" /> },
      { to: '/empleados', content: 'Empleados', Icon: <ICONS.Worker size="20px" /> },
      { to: '/maquinas', content: 'Máquinas', Icon: <ICONS.Machine size="23px" /> },
      { to: '/modelos', content: 'Modelos', Icon: <ICONS.Shoe size="22px" /> },
      { to: '/clientes', content: 'Clientes', Icon: <ICONS.HandShake size="20px" /> },
      { to: '/proveedores', content: 'Proveedores', Icon: <ICONS.Truck size="20px" /> },
      { to: '/materiales', content: 'Materiales', Icon: <ICONS.Thread size="23px" /> },
      { to: '/pedidos', content: 'Pedidos', Icon: <ICONS.Diablito size="23px" /> },
      { to: '/Produccion', content: 'Captura de Producción', Icon: <ICONS.Qr size="23px" /> },
      { to: '/reportes', content: 'Reportes', Icon: <ICONS.Charts size="20px" /> }
    ],
    'Desarrollador': [
      { to: '/modelos', content: 'Modelos', Icon: <ICONS.Shoe size="22px" /> },
    ],
    'Encargado': [
      { to: '/empleados', content: 'Empleados', Icon: <ICONS.Worker size="20px" /> },
      { to: '/maquinas', content: 'Máquinas', Icon: <ICONS.Machine size="23px" /> },
      { to: '/modelos', content: 'Modelos', Icon: <ICONS.Shoe size="22px" /> },
      { to: '/clientes', content: 'Clientes', Icon: <ICONS.HandShake size="20px" /> },
      { to: '/proveedores', content: 'Proveedores', Icon: <ICONS.Truck size="20px" /> },
      { to: '/materiales', content: 'Materiales', Icon: <ICONS.Thread size="23px" /> },
      { to: '/pedidos', content: 'Pedidos', Icon: <ICONS.Diablito size="23px" /> },
      { to: '/Produccion', content: 'Captura de Producción', Icon: <ICONS.Qr size="23px" /> },
      { to: '/reportes', content: 'Reportes', Icon: <ICONS.Charts size="20px" /> }
    ],
    'Produccion': [
      { to: '/Produccion', content: 'Captura de Producción', Icon: <ICONS.Qr size="23px" /> }
    ],
    'Reportes': [
      { to: '/reportes', content: 'Reportes', Icon: <ICONS.Charts size="20px" /> }
    ]
  };



  return (
    <div id="appbar-container" className={` z-50 flex relative w-18 h-full bg-white`} >
      <div id='appbar' className='absolute w-full h-full overflow-x-hidden overflow-y-scroll ease-in-out bg-teal-700 shadow-md '>

        <div className='absolute flex flex-col justify-center w-full h-full'>

          <div className="flex justify-center w-full py-4 appbar-content">
            <img className="w-24 h-24" src={helechos} alt="" />
          </div>

          <div id="tabs" className='grid gap-1'>
            <Tab to={'/perfil'} content={'Perfil'} Icon={<ICONS.Profile size="19" />} />
            {tabsByRole[rol].map((tab, index) =>
              <Tab
                key={`${rol}-${index}`}
                tab={tab}
                to={tab.to}
                Icon={tab.Icon}
                content={tab.content}
              />)}
          </div>
          <div className='flex items-end w-full h-full pb-10'>
            <Tab
              onClick={Logout}
              to={'/login'}
              content={'Salir'}
              Icon={<ICONS.Logout size="20" />} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppBar
