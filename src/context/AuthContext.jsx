import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify";
import { useApp } from "./AppContext";
import 'react-toastify/dist/ReactToastify.css';
import {entorno} from "../constants/entornos.jsx"


const apiLoginUrl = entorno+"/login/"
const apiRefreshTokenUrl = entorno+"/api/token/refresh/"

const AuthContext = React.createContext()
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  let auth = localStorage.getItem('auth')
  let [session, setSession] = useState(() => auth ? JSON.parse(auth) : null)
  //let [user, setUser] = useState(null)
  let [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const notify = (message, error = false) => {
    let options = {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    }
    error ? toast.error(message, options) : toast.success(message, options)
  }

  useEffect(() => {
    if (loading)
      updateToken()

    let fourMinutes = 1000 * 60 * 4
    let interval = setInterval(() => {
      if (session)
        updateToken()
    }, fourMinutes)
    return () => clearInterval(interval)

  }, [session, loading])

  const Login = async (values) => {
    values = { ...values, usuario: values.usuario.trim() }
    const response = await fetch(apiLoginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
    let data = await response.json()

    if (response.status === 200) {
      //let tokens = { access: data.access, refresh: data.refresh }
      //console.log( tokens )

      setSession(data)
      //setAuthTokens(tokens)
      localStorage.setItem('auth', JSON.stringify(data))
      notify('Bienvenido')
      //alert(data.message)
      navigate('/empleados')
    }
    else {
      if (data.error) {
        notify(data.error, true)
      }
      else if (!data.usuario.is_active) {
        notify("Usuario no Activo", true)
      }
    }
  }

  const Logout = () => {
    //setUser(null)
    setSession(null)
    localStorage.removeItem('auth')
    navigate('/')
  }

  let updateToken = async () => {

    let response = await fetch(apiRefreshTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh': session?.refresh })
    })

    let data = await response.json()

    if (response.status === 200) {
      let newSession = { ...session, access: data.access, refresh: data.refresh }
      setSession(newSession)
      localStorage.setItem('auth', JSON.stringify(newSession))
    } else {
      Logout()
    }
    if (loading) {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session, setSession,
        Login,
        Logout,
        updateToken,
        notify
      }}
    >
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  )
}