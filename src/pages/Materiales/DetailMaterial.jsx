import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import { useMateriales } from "./hooks/useMateriales";
import { useProveedores } from "../../pages/Proveedores/hooks/useProveedores";
import React from 'react'
import { SketchPicker } from 'react-color'
import Loader from "../../components/Loader/Loader";
import OptsInpt from "../../components/Inputs/OptsInpt";
import Inpt from "../../components/Inputs/Inpt";
import FieldsBox from "../../components/FieldsBox";

const initMaterial = {
  idMaterial: "",
  tipo: null,
  color: "",
  calibre: null,
  proveedor: null,
  tenida: "",
  codigoColor: "#ffffff",
  idProveedor: null,
  nombreProveedor: "",
}

const DetailMaterial = () => {

  const { saveMaterial, loading, findMaterial, allMateriales, setLoading } = useMateriales()
  const { refreshProveedores, allProveedores } = useProveedores()
  const [optionsProveedor, setOptionsProveedor] = useState([])
  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = (id !== '0')
  const [sketchPickerColor, setSketchPickerColor] = useState("#ffffff");
  const [displaySketchPickerColor, setDisplaySketchPickerColor] = useState(false)
  const [theresChanges, setTheresChanges] = useState(false)
  const traerProveedores = async () => await refreshProveedores();

  useEffect(() => traerProveedores(), [])
  useEffect(() => {
    var temp = [{ value: 'Seleccione', label: 'Seleccione' }]
    allProveedores.map((proveedor) => {
      temp.push({ value: proveedor.idProveedor.toString(), label: proveedor.nombre })
    });
    setOptionsProveedor(temp)
  }, [allProveedores])

  const optionsTipo = [
    { value: 'Poliester', label: 'Poliester' },
    { value: 'Melting', label: 'Melting' },
    { value: 'Lurex', label: 'Lurex' },
    { value: 'Goma', label: 'Goma' },
    { value: 'Licra desnuda', label: 'Licra desnuda' },
    { value: 'Division', label: 'Division' },
  ]

  const optionsCalibre = [
    { value: '---', label: '---' },
    { value: '150', label: '150' },
    { value: '300', label: '300' }
  ]

  const validate = values => {
    const errors = {};
    if (!values.tenida) {
      errors.tenida = 'Ingresa la teñida del color';
    }
    if (!values.color) {
      errors.color = 'Ingresa el nombre del color';
    }
    if (!values.tipo) {
      errors.tipo = 'Selecciona un tipo';
    } else if (values.tipo === 'Seleccione') {
      errors.tipo = 'Selecciona un tipo';
    }
    if (!values.calibre) {
      errors.calibre = 'Selecciona un calibre';
    } else if (values.calibre === 'Seleccione') {
      errors.calibre = 'Selecciona un calibre';
    }
    if (!values.idProveedor) {
      errors.idProveedor = 'Selecciona un proveedor';
    } else if (values.idProveedor === 'Seleccione') {
      errors.idProveedor = 'Selecciona un proveedor';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: null,
    validate,
    onSubmit: async (values) => {
      values.codigoColor = sketchPickerColor;
      await saveMaterial({ values: values, method: isEdit ? 'PUT' : 'POST' })
      navigate("/materiales")
    },
  });

  useEffect(async () => {
    try {
      setLoading(true)
      formik.setValues(
        id === '0' ? initMaterial :
          allMateriales.length > 0 ? allMateriales.find(m => m.idMaterial + '' === id) :
            await findMaterial(id)
      )
    } catch (e) {

    } finally {
      setLoading(false)
    }
  }, [id]);


  useEffect(() => {
    setSketchPickerColor(formik.values ? formik.values.codigoColor : "#ffffff");
  }, [formik.values?.codigoColor]);


  const handleChange = (e) => {
    formik.setFieldValue(e.target.name, e.target.value)
    setTheresChanges(true)
  }

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div id="tbl-page" className="absolute flex flex-col w-full h-full p-4 bg-slate-100">
          <div className="flex justify-between pb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full neutral-button"> <ICONS.Left size="30px" /> </button>
              <p className="pl-3 text-2xl font-bold text-teal-800/80">
                {isEdit ? `Detalles del material` : "Nuevo material"}
              </p>
            </div>

            <input
              disabled={loading || !theresChanges}
              className='w-40 p-1 text-white bg-teal-500 rounded-lg normal-button'
              type="submit"
              value={isEdit ? "Guardar" : "Agregar"}
              form="frmMateriales"
            />


          </div>
          <div className="relative flex flex-col h-full bg-white rounded-t-lg shadow-lg">
            <div className='flex flex-col w-full h-full '>
              <div className="flex w-full h-full ">
                {formik?.values === null ? <Loader /> :
                  <form
                    id='frmMateriales'
                    className='relative flex flex-col w-full h-full overflow-y-scroll'
                    onSubmit={formik.handleSubmit}>
                    <div className="absolute flex flex-col w-full p-4">
                      <div className='flex flex-row w-full h-full p-2 total-center'>
                        <div className="relative flex items-center justify-center w-full text-center">
                          <ICONS.Thread className='' size='100px' style={{ color: '#0f766e' }} />
                        </div>
                      </div>
                      <div className="flex w-full">

                        <FieldsBox title="Datos del material">

                          <div className='flex flex-row gap-6'>
                            <OptsInpt
                              label='Tipo'
                              name='tipo'
                              options={optionsTipo}
                              formik={formik}
                              fieldChange={() => setTheresChanges(true)}
                              placeholder='Seleccione'

                            />
                            <OptsInpt
                              label='Calibre'
                              name='calibre'
                              options={optionsCalibre}
                              formik={formik}
                              fieldChange={() => setTheresChanges(true)}
                              placeholder='Seleccione'

                            />
                          </div>
                          <div className='flex flex-row gap-6'>
                            <OptsInpt
                              label='Proveedor'
                              name='idProveedor'
                              options={optionsProveedor}
                              formik={formik}
                              fieldChange={() => setTheresChanges(true)}
                              placeholder='Seleccione'

                            />
                            <Inpt
                              label='Color' type='text' name='color'
                              formik={formik}
                              onKeyDown={() => setTheresChanges(true)}
                            />
                          </div>
                          <div className='flex flex-row gap-6'>
                            <div className="flex flex-col w-full">
                              <p className={'text-sm font-medium text-teal-800/80 pb-0.5'}>Código de color</p>
                              <div

                                className="relative flex flex-row items-center justify-between h-10 pl-4 font-semibold text-gray-800 duration-100 bg-gray-100 border rounded-md hover:border-teal-500">
                                <div>{sketchPickerColor}</div>
                                <div
                                  onClick={() => {
                                    setDisplaySketchPickerColor(!displaySketchPickerColor)
                                  }}
                                  style={{
                                    backgroundColor: `${sketchPickerColor}`,
                                  }}

                                  className="w-20 h-8 mr-1 border rounded-md "
                                >
                                </div>
                                {displaySketchPickerColor ?
                                  <div className="absolute right-0 top-full">
                                    <SketchPicker
                                      onChange={(color) => {
                                        setSketchPickerColor(color.hex);
                                        setTheresChanges(true);
                                      }}
                                      color={sketchPickerColor}
                                    />
                                  </div>
                                  : null
                                }
                              </div>
                            </div>
                            <Inpt
                              label='Teñida / Calidad' type='text' name='tenida'
                              formik={formik}
                              onKeyDown={() => setTheresChanges(true)}
                            />
                          </div>
                          <div className="h-36">

                          </div>
                        </FieldsBox>
                      </div>
                    </div>
                  </form>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default DetailMaterial