import { useFormik } from "formik";
import { useState, useNavigate } from "react";
import { ICONS } from "../../constants/icons";
import { useMateriales } from "./hooks/useMateriales";
import { useProveedores } from "../../pages/Proveedores/hooks/useProveedores";
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import React from 'react'
import { SketchPicker } from 'react-color'

const initobj = {
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


  const { getMaterial, saveMaterial, loading} = useMateriales()
  const { getProveedores, allProveedores} = useProveedores()
  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = (id !== '0')
  const [sketchPickerColor, setSketchPickerColor] = useState(material.codigoColor);
  const [displaySketchPickerColor, setDisplaySketchPickerColor] = useState(false)

  const llenarProveedores = async () => { await getProveedores() };

  useEffect(() => { llenarProveedores() }, [])
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
    { value: 'Licra desnuda', label: 'Licra desnuda' }
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
    initialValues: material,
    validate,
    onSubmit: values => {
      values.codigoColor=sketchPickerColor;
      handleSaveMateriales(values);
    },
  });

  const handleSaveMateriales = async (values) => {
    setSaving(true)
    await saveMaterial(values, isEdit)
    await getMateriales()
    onCloseModal()
    setSaving(false)
  }

  return (
    <div id="form-modal-materiales"
      className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
      <div className='modal-box h-full w-3/4 rounded-lg bg-white shadow-xl'  >
        <div className='w-full flex h-full flex-col '>
          <div className="z-10 py-2 px-4 flex w-full shadow-md ">
            <div className="flex flex-row w-full total-center relative h-10">
              {isEdit
                ? <ICONS.Edit className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />
                : <ICONS.Plus className='mt-1 mr-2' size='20px' style={{ color: '#115e59' }} />}
              <p className='font-semibold text-teal-800 text-2xl' >
                {isEdit ? 'Editar Material' : 'Nuevo Material'}
              </p>
              <input
                disabled={saving}
                className='bg-teal-500 p-1 w-40 text-white normal-button absolute right-0 rounded-lg'
                type="submit"
                value={isEdit ? "GUARDAR" : "AGREGAR"}
                form="frmMateriales" />
              <button
                className='total center neutral-button p-1 text-white rounded-lg  absolute left-0 '
                onClick={onCloseModal}>
                <ICONS.Cancel className='m-0' size='25px' />
              </button>
            </div>
          </div>
          <div className="flex w-full h-full ">
            <form
              id='frmMateriales'
              className='flex flex-col h-full w-full relative overflow-y-scroll'
              onSubmit={formik.handleSubmit}>
              <div className="absolute w-full flex flex-col  px-4">
                <div className='flex flex-row w-full h-full p-2 total-center'>
                  <div className="flex relative w-full items-center justify-center text-center">
                    <ICONS.Cloth className='' size='100px' style={{ color: '#115e59' }} />
                  </div>
                </div>
                <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                  <div className="absolute w-full total-center -top-3">
                    <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                      DATOS MATERIAL
                    </div>
                  </div>
                  <div className='flex flex-row'>
                    <CustomSelect
                      name='tipo'
                      className='input'
                      onChange={value => formik.setFieldValue('tipo', value.value)}
                      value={formik.values.tipo}
                      onBlur={formik.handleBlur}
                      options={optionsTipo}
                      label='Tipo'
                      errores={formik.errors.tipo && formik.touched.tipo ? formik.errors.tipo : null}
                    />
                    <CustomSelect
                      name='calibre'
                      className='input'
                      onChange={value => formik.setFieldValue('calibre', value.value)}
                      value={formik.values.calibre}
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
                      onChange={value => formik.setFieldValue('idProveedor', value.value)}
                      value={formik.values.idProveedor}
                      onBlur={formik.handleBlur}
                      options={optionsProveedor}
                      label='Proveedor'
                      errores={formik.errors.idProveedor && formik.touched.idProveedor ? formik.errors.idProveedor : null}
                    />
                    <Input
                      label='Color' type='text' name='color' value={formik.values ? formik.values.color : ''}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.color && formik.touched.color ? formik.errors.color : null}

                    />
                  </div>
                  <div className='flex flex-row'>
                    <div className="flex flex-col w-full mx-2 mt-2">
                      <p className={'font-medium text-teal-800'}>Código de color</p>
                      <div className="relative flex flex-row border p-1 justify-between">
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
                          }}
                          color={sketchPickerColor}
                        /></div> : null}


                      </div>

                    </div>
                    <Input
                      label='Teñida' type='text' name='tenida' value={formik.values.tenida}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}
                      errores={formik.errors.tenida && formik.touched.tenida ? formik.errors.tenida : null}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default DetailMaterial