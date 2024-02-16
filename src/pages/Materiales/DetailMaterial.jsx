import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import { useMateriales } from "./hooks/useMateriales";
import { useProveedores } from "../../pages/Proveedores/hooks/useProveedores";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import React from 'react'
import { SketchPicker } from 'react-color'
import Loader from "../../components/Loader/Loader";

const initMaterial = {
  idMaterial: "",
  tipo: "Seleccione",
  color: "",
  calibre: "Seleccione",
  proveedor: "Seleccione",
  tenida: "",
  codigoColor: "#ffffff",
  idProveedor: "Seleccione",
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
    { value: 'Seleccione', label: 'Seleccione' },
    { value: 'Poliester', label: 'Poliester' },
    { value: 'Melting', label: 'Melting' },
    { value: 'Lurex', label: 'Lurex' },
    { value: 'Goma', label: 'Goma' },
    { value: 'Licra desnuda', label: 'Licra desnuda' },
    { value: 'Division', label: 'Division' },
  ]

  const optionsCalibre = [
    { value: 'Seleccione', label: 'Seleccione' },
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
              <p className="pl-3 text-2xl font-bold text-teal-700">
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
                    <div className="absolute flex flex-col w-full px-4">
                      <div className='flex flex-row w-full h-full p-2 total-center'>
                        <div className="relative flex items-center justify-center w-full text-center">
                          <ICONS.Thread className='' size='100px' style={{ color: '#0f766e' }} />
                        </div>
                      </div>
                      <div className="relative px-2 py-4 mx-2 my-4 border-2 border-slate-300">
                        <div className="absolute w-full total-center -top-3">
                          <div className='px-3 text-base italic font-bold text-teal-700 bg-white' >
                            Datos del material
                          </div>
                        </div>
                        <div className='flex flex-row'>
                          <CustomSelect
                            name='tipo'
                            className='input'
                            onChange={value => {formik.setFieldValue('tipo', value.value); setTheresChanges(true)}}
                            value={formik.values ? formik.values.tipo : "Seleccione"}
                            onBlur={formik.handleBlur}
                            options={optionsTipo}
                            label='Tipo'
                            errores={formik.errors.tipo && formik.touched.tipo ? formik.errors.tipo : null}
                          />
                          <CustomSelect
                            name='calibre'
                            className='input'
                            onChange={value => {formik.setFieldValue('calibre', value.value);setTheresChanges(true)}}
                            value={formik.values ? formik.values.calibre : "Seleccione"}
                            onBlur={formik.handleBlur}
                            options={optionsCalibre}
                            label='Calibre'
                            errores={formik.errors.calibre && formik.touched.calibre ? formik.errors.calibre : null}
                          />
                        </div>
                        <div className='flex flex-row'>
                          <CustomSelect
                            name='idProveedor'
                            className='input'
                            onChange={value => {formik.setFieldValue('idProveedor', value.value);setTheresChanges(true)}}
                            value={formik.values ? formik.values.idProveedor : "Seleccione"}
                            onBlur={formik.handleBlur}
                            options={optionsProveedor}
                            label='Proveedor'
                            errores={formik.errors.idProveedor && formik.touched.idProveedor ? formik.errors.idProveedor : null}
                          />
                          <Input
                            label='Color' type='text' name='color' value={formik.values ? formik.values.color : ''}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.color && formik.touched.color ? formik.errors.color : null}
                          />
                        </div>
                        <div className='flex flex-row'>
                          <div className="flex flex-col w-full mx-2 mt-2">
                            <p className={'font-medium text-teal-700'}>Código de color</p>
                            <div className="relative flex flex-row justify-between p-1 border">
                              <div>{sketchPickerColor}</div>
                              <div
                                style={{
                                  backgroundColor: `${sketchPickerColor}`,
                                }}
                                onClick={() => {
                                  setDisplaySketchPickerColor(!displaySketchPickerColor)
                                }}
                                className="w-8 h-full border-2"
                              >
                              </div>
                              {displaySketchPickerColor ? <div className="absolute right-0 top-8"><SketchPicker
                                onChange={(color) => {
                                  
                                  setSketchPickerColor(color.hex);
                                  setTheresChanges(true);
                                }}
                                color={sketchPickerColor}
                              /></div> : null}

                            </div>
                          </div>
                          <Input
                            label='Teñida / Calidad' type='text' name='tenida' value={formik.values ? formik.values.tenida : ""}
                            onChange={handleChange} onBlur={formik.handleBlur}
                            errores={formik.errors.tenida && formik.touched.tenida ? formik.errors.tenida : null}
                          />
                        </div>
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