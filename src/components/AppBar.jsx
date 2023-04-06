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
    const isActive = useMatch({ path: resolvePath.pathname, end: true })
    let activeStyles = isActive ? `bg-teal-700 hover:bg-teal-700` : `hover:bg-teal-500`
    return (
      <Link to={to}
        {...props}
        className={`text-white relative w-full flex flex-row py-3
            font-bold text-sm  duration-200 rounded-lg
            items-center  cursor-pointer ` + activeStyles}>
        <p className='w-14 total-center'>
          {Icon && <Icon size='20px' />}
        </p>
        <p className='absolute ml-14 appbar-content align-center flex'>
          {content}
        </p>
      </Link>
    )
  }

  return (
    <>
      {/*<div className='w-14'></div> */}
      <div
        id='appbar'
        className={`z-20 flex flex-col absolute h-screen pl-2
                    overflow-y-scroll overflow-x-hidden 
                    w-18 bg-teal-600 duration-200 ease-in-out hover:w-60`} >
        <div className="appbar-content flex w-full justify-center mt-5 ">
          <img className="w-24 h-24" src={helechos} alt="" />
        </div>
        <div id="tabs" className="mt-10">
          <Tab to={'/perfil'} content={'PERFIL'} Icon={ICONS.Profile} />
          {session.usuario.is_staff && <Tab to={'/usuarios'} content={'USUARIOS'} Icon={ICONS.Admin} />}
          <Tab to={'/empleados'} content={'EMPLEADOS'} Icon={ICONS.Worker} />
          <Tab to={'/maquinas'} content={'MAQUINAS'} Icon={ICONS.Machine} />
          <Tab to={'/modelos'} content={'MODELOS'} Icon={ICONS.Shoe} />
          <Tab to={'/clientes'} content={'CLIENTES'} Icon={ICONS.HandShake} />
          <Tab to={'/proveedores'} content={'PROVEEDORES'} Icon={ICONS.Truck} />
          <Tab to={'/materiales'} content={'MATERIALES'} Icon={ICONS.Cloth} />
          {
            /* 
            <Tab to={'/pedidos'} content={'PEDIDOS'} Icon={ICONS.Diablito} />
            <Tab to={'/modelos'} content={'MODELOS'} Icon={ICONS.Cloth} />
            
            <Tab to={'/provedores'} content={'PROVEDORES'} Icon={ICONS.Truck} />
            <Tab to={'/produccion'} content={'PRODUCCION'} Icon={ICONS.Boot} />
           */
          }
        </div>
        <div className='flex h-full items-end w-full pb-10'>
          <Tab
            onClick={Logout}
            to={'/login'}
            content={'SALIR'}
            Icon={ICONS.Logout} />
        </div>
      </div>
    </>
  )
}

export default AppBar