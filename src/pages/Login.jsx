import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import loginImg from '../imgs/logo.png'
import { useAuth } from '../context/AuthContext'

const apiLoginUrl = "http://127.0.0.1:8000/login/"

export default function Login({ navigate }) {

  const { Login } = useAuth()


  return (
    <Formik
      initialValues={{ usuario: '', password: '' }}
      validationSchema={
        Yup.object({
          usuario: Yup.string()
            .required('Ingresa tu usuario'),
          password: Yup.string()
            .required('Ingresa tu contraseña')
        })
      }
      onSubmit={(values, { setSubmitting }) => {

        Login(values)
        setSubmitting(false)
        /*setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
          setUser(true)
        }, 400);*/
      }}
    >
      <div className='relative flex w-full h-screen px-4 total-center md:px-0 bg-login'>
        <div className="flex relative max-w-[500px] w-full  mx-auto">

          <Form id='login-box' className='w-full p-8 rounded-lg shadow-lg emerge'>
            <h2 className='text-xl font-bold tracking-wider text-center text-gray-600 '>INICIA SESIÓN</h2>
            <div className='flex justify-center py-4'>
              <img src={loginImg} alt='logo' className='w-32 h-32' />
            </div>
            <div className='flex flex-col'>
              <label className='pb-1 font-medium text-gray-600'>Usuario</label>
              <Field className='px-3 py-2 font-semibold text-gray-800 duration-100 bg-gray-100 border border-gray-300 rounded-md outline-none focus:border-teal-600 hover:border-teal-600'
                type="text"
                name='usuario'
              />
              <div className='h-10 pl-1 italic font-medium text-rose-400 appear'>
                <ErrorMessage name="usuario" />
              </div>
            </div>
            <div className='flex flex-col'>
              <label className='pb-1 font-medium text-gray-600'>Contraseña</label>
              <Field className='px-3 py-2 font-semibold text-gray-800 duration-100 bg-gray-100 border border-gray-300 rounded-md outline-none focus:border-teal-600 hover:border-teal-600'
                type="password"
                name='password'
              />
              <div className='h-10 pl-1 italic font-medium text-rose-400 appear'>
                <ErrorMessage name="password" />
              </div>
            </div>


            <button
              type='submit  '
              className='w-full py-2 my-5 text-lg font-semibold tracking-wider text-white duration-200 bg-teal-600 rounded-lg shadow-lg hover:shadow-teal-600 hover:bg-slate-700 touchable-opacity'>
              INGRESAR
            </button>
          </Form>
        </div>
      </div>
    </Formik>
  )
}