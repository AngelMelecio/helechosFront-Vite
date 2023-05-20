import { useFormik, FormikProvider } from "formik"
import { useEffect } from "react"
import Input from "../../../components/Input";
import CustomSelect from "../../../components/CustomSelect";
import DynamicInput from "../../../components/DynamicInput"
import SelectorMateriales from "../components/selectorMateriales";
import { toUrl } from "../../../constants/functions";
import { ICONS } from "../../../constants/icons";
import PesosList from "./PesosList";
import { useRef } from "react";
import { useMaquinas } from "../../Maquinas/hooks/useMaquinas";
import { useState } from "react";
import Loader from "../../../components/Loader/Loader";
import { useFichas } from "../hooks/useFichas";
import { useMateriales } from "../../Materiales/hooks/useMateriales";
import { useParams } from "react-router-dom";
import { useDetailModelos } from "../hooks/useDetailModelos";
import { useFichaMateriales } from "../hooks/useFichaMateriales";

const FrmFichas = ({
  ficha,
}) => {

  const { id } = useParams()
  const formRef = useRef(null)

  const { allMaquinas, refreshMaquinas } = useMaquinas()
  const [tejidoOptions, setTejidoOptions] = useState([])
  const [planchaOptions, setPlanchaOptions] = useState([])

  const {
    setTheresChangesFicha,
    pageScrollBottom
  } = useDetailModelos()


  const {
    refreshFichaMateriales,
    allFichaMateriales,
    fetchingFichaMateriales,
  } = useFichaMateriales()

  const { saveFicha } = useFichas()

  const validate = values => {
    const errors = {};

    if (!values.talla) {
      errors.talla = 'Ingresa la talla';
    }
    if (!values.maquinaTejido) {
      errors.maquinaTejido = 'Selecciona una maquina ';
    } else if (values.maquinaTejido === "Seleccione") {
      errors.maquinaTejido = 'Selecciona una maquina';
    }
    if (!values.tipoMaquinaTejido) {
      errors.tipoMaquinaTejido = 'Ingresa el tipo de la maquina';
    }
    if (!values.galga) {
      errors.galga = 'Ingresa la galga';
    }
    if (!values.maquinaPlancha) {
      errors.maquinaPlancha = 'Selecciona una maquina ';
    } else if (values.maquinaPlancha === "Seleccione") {
      errors.maquinaPlancha = 'Selecciona una maquina';
    }
    return errors;
  };

  const fichaFormik = useFormik({
    initialValues: ficha,
    validate,
    onSubmit: async (values) => {
      setTheresChangesFicha(false)
      await saveFicha({
        values: {
          ...values,
          modelo: id,
        },
        materiales: values.materiales,
        method: ficha.idFichaTecnica ? 'PUT' : 'POST'
      })
    }
  })

  useEffect(() => {
    refreshMaquinas()
  }, [])

  useEffect(() => {
    fichaFormik.setFieldValue('materiales', allFichaMateriales)
    //console.log('EFFECTO formulario cargo ficha-materiales', allFichaMateriales)
  }, [allFichaMateriales])

  // Cargamos las opciones de las maquinas
  useEffect(() => {
    setTejidoOptions(
      allMaquinas
        .filter(m => (m.departamento === 'Tejido'))
        .map(m => ({ value: m.idMaquina.toString(), label: 'Línea: ' + m.linea + ' Número: ' + m.numero + ' Marca: ' + m.marca }))
    )
    setPlanchaOptions(
      allMaquinas
        .filter(m => (m.departamento === 'Plancha'))
        .map(m => ({ value: m.idMaquina.toString(), label: 'Línea: ' + m.linea + ' Número: ' + m.numero + ' Marca: ' + m.marca }))
    )
  }, [allMaquinas])


  // Cuando no queremos scroll en el Form lo regresamos hasta arriba
  useEffect(() => {
    if (!pageScrollBottom) {
      formRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pageScrollBottom])


  // Cargamos los materiales de la ficha
  useEffect(async () => {
    fichaFormik.setValues(ficha)
    //console.log('EFFECTO\n FRM FICHA ficha:', ficha)
    if (!ficha.copied) {
      await refreshFichaMateriales(ficha.idFichaTecnica)
    }
  }, [ficha?.idFichaTecnica])

  const handleSelectFile = (e) => {
    fichaFormik.setValues(prev => ({ ...prev, [e.target.name]: e.target.files[0] }))
    setTheresChangesFicha(true)
  }
  const handleFichaChange = (e) => {
    fichaFormik.setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setTheresChangesFicha(true)
  }

  const onPassMateriales = (availableMateriales) => {
    let newMateriales = []
    availableMateriales.forEach(m => {
      if (m.count > 0) {
        for (let i = 0; i < m.count; i++) {
          newMateriales.push({
            peso: 0,
            tipo: m.tipo,
            color: m.color,
            codigoColor: m.codigoColor,
            tenida: m.tenida,
            hebras: "",
            calibre: m.calibre,
            guiaHilos: "",
            nombreProveedor: m.nombreProveedor,
            idMaterial: m.idMaterial
          })
        }
      }
    })
    fichaFormik.setValues(prev => ({ ...prev, materiales: [...prev.materiales, ...newMateriales] }))
    setTheresChangesFicha(true)
  }


  return (
    <div
      ref={formRef}
      className={`flex flex-col h-full w-full ${pageScrollBottom ? "overflow-y-scroll" : "overflow-hidden pr-3"}`}>
      <FormikProvider value={fichaFormik}>
        <form
          id='frmFichas' onSubmit={fichaFormik.handleSubmit}
          className='flex flex-col h-full w-full relative '>
          <div className="absolute w-full flex flex-col p-4">
            <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
              <div className="absolute w-full total-center -top-3">
                <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                  INFORMACIÓN DE LA FICHA
                </div>
              </div>
              <div className="w-full total-center">
                <div className="flex relative w-full items-center justify-center foto text-center">
                  { /* Imagen del Modelo */}
                  {(toUrl(fichaFormik.values?.fotografia) !== null) && <img
                    className='object-cover foto'
                    src={toUrl(fichaFormik.values?.fotografia)}
                    alt='' />}
                  <input id='file' type="file" name='fotografia' accept='image/*'
                    onChange={handleSelectFile} className='inputfile' />
                  <label
                    className='absolute -bottom-2 -right-1 p-2 normal-button rounded-full'
                    htmlFor='file' >
                    <ICONS.Upload style={{ color: 'white' }} size='18px' />
                  </label>
                </div>
              </div>
              <div className='flex flex-row w-full'>
                <Input
                  label='Nombre de la Ficha' type='text' name='nombre' value={fichaFormik?.values?.nombre}
                  onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                  errores={fichaFormik?.errors.nombre && fichaFormik?.touched.nombre ? fichaFormik?.errors.nombre : null}
                />
              </div>
              <div className="flex flex-row w-full">
                <Input
                  label='Talla' type='text' name='talla' value={fichaFormik?.values?.talla}
                  onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                  errores={fichaFormik?.errors.talla && fichaFormik?.touched.talla ? fichaFormik?.errors.talla : null}
                />
                <Input
                    label='Nombre del Programa' type='text' name='nombrePrograma' value={fichaFormik?.values?.nombrePrograma}
                    onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                    errores={fichaFormik?.errors.nombrePrograma && fichaFormik?.touched.nombrePrograma ? fichaFormik?.errors.nombrePrograma : null}
                  />
                
              </div>
            </div>
            <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
              <div className="absolute w-full total-center -top-3">
                <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                  DATOS DEL TEJIDO
                </div>
              </div>
              <div className="flex flex-row w-full">
                <div className="flex flex-row w-full">
                  <CustomSelect
                    name='maquinaTejido'
                    className='input z-[30]'
                    onChange={value => { fichaFormik.setFieldValue('maquinaTejido', value.value); setTheresChangesFicha(true) }}
                    value={fichaFormik?.values?.maquinaTejido}
                    onBlur={fichaFormik.handleBlur}
                    options={tejidoOptions}
                    label='Máquina Tejido'
                    errores={fichaFormik.errors.maquinaTejido && fichaFormik.touched.maquinaTejido ? fichaFormik.errors.maquinaTejido : null}
                  />
                  <Input
                    label='Tipo Maquina Tejido' type='text' name='tipoMaquinaTejido' value={fichaFormik?.values?.tipoMaquinaTejido}
                    onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                    errores={fichaFormik?.errors.tipoMaquinaTejido && fichaFormik?.touched.tipoMaquinaTejido ? fichaFormik?.errors.tipoMaquinaTejido : null}
                  />
                </div>
                <div className="flex flex-row w-full">
                  <Input
                    label='Galga' type='text' name='galga' value={fichaFormik?.values?.galga}
                    onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                    errores={fichaFormik?.errors.galga && fichaFormik?.touched.galga ? fichaFormik?.errors.galga : null}
                  />
                  <Input
                    label='Velocidad' type='text' name='velocidadTejido' value={fichaFormik?.values?.velocidadTejido}
                    onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                    errores={fichaFormik?.errors.velocidadTejido && fichaFormik?.touched.velocidadTejido ? fichaFormik?.errors.velocidadTejido : null}
                  />
                  <Input
                    label='Tiempo de bajada' type='text' name='tiempoBajada' value={fichaFormik?.values?.tiempoBajada}
                    onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                    errores={fichaFormik?.errors.tiempoBajada && fichaFormik?.touched.tiempoBajada ? fichaFormik?.errors.tiempoBajada : null}
                  />
                </div>
              </div>
            </div>
            <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
              <div className="absolute w-full total-center -top-3">
                <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                  DATOS DE PLANCHA
                </div>
              </div>
              <div className="flex flex-row w-full">
                <div className="flex flex-row w-full">
                  <CustomSelect
                    name='maquinaPlancha'
                    className='input z-[20]'
                    onChange={value => { fichaFormik.setFieldValue('maquinaPlancha', value.value); setTheresChangesFicha(true) }}
                    value={fichaFormik?.values?.maquinaPlancha}
                    onBlur={fichaFormik.handleBlur}
                    options={planchaOptions}
                    label='Máquina de Plancha'
                    errores={fichaFormik.errors.maquinaPlancha && fichaFormik.touched.maquinaPlancha ? fichaFormik.errors.maquinaPlancha : null}
                  />
                </div>
                <div className="flex flex-row w-full">
                  <Input
                    label='Velocidad' type='text' name='velocidadPlancha' value={fichaFormik?.values?.velocidadPlancha}
                    onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                    errores={fichaFormik?.errors.velocidadPlancha && fichaFormik?.touched.velocidadPlancha ? fichaFormik?.errors.velocidadPlancha : null}
                  />
                  <Input
                    label='Temperatura' type='text' name='temperaturaPlancha' value={fichaFormik?.values?.temperaturaPlancha}
                    onChange={handleFichaChange} onBlur={fichaFormik?.handleBlur}
                    errores={fichaFormik?.errors.temperaturaPlancha && fichaFormik?.touched.temperaturaPlancha ? fichaFormik?.errors.temperaturaPlancha : null}
                  />
                </div>
              </div>
            </div>

            <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
              <div className="absolute w-full total-center -top-3">
                <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                  DATOS DE LOS HILOS
                </div>
              </div>
              {!fetchingFichaMateriales && fichaFormik?.values?.materiales ?
                <>
                  <PesosList
                    materiales={fichaFormik?.values?.materiales}
                  />
                  <div className="flex flex-row w-full">
                    {<SelectorMateriales
                      fichaTecnicaObj={fichaFormik}
                      onPassMateriales={onPassMateriales}
                    />}
                  </div>
                </>
                :
                <Loader />
              }
            </div>
            <div className="flex flex-row">
              <div className="w-full relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                <div className="absolute w-full total-center -top-3">
                  <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                    NUMERO PUNTOS
                  </div>
                </div>
                <div className="flex flex-row h-80  justify-around">
                  <div className="overflow-y-scroll">
                    <DynamicInput
                      columns={[
                        { name: 'Numero', atr: 'valor' },
                        { name: 'Puntos', atr: 'posicion' }
                      ]}
                      elements={fichaFormik?.values?.numeroPuntos || []}
                      arrayName='numeroPuntos'
                      handleChange={fichaFormik.handleChange}
                      clearObject={{ valor: '', posicion: '' }}
                      setTheresChanges={setTheresChangesFicha}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                <div className="absolute w-full total-center -top-3">
                  <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                    ECONOMISADORES
                  </div>
                </div>
                <div className="flex flex-row h-80  justify-around">
                  <div className="overflow-y-scroll">
                    <DynamicInput
                      columns={[
                        { name: 'Numero', atr: 'valor' },
                        { name: 'Puntos', atr: 'posicion' }
                      ]}
                      elements={fichaFormik?.values?.economisadores || []}
                      arrayName='economisadores'
                      handleChange={fichaFormik.handleChange}
                      clearObject={{ valor: '', posicion: '' }}
                      setTheresChanges={setTheresChangesFicha}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative px-2 py-4 border-2 mx-2 my-4 border-slate-300">
                <div className="absolute w-full total-center -top-3">
                  <div className='bg-white px-3 font-medium text-teal-800 text-sm italic' >
                    JALONES
                  </div>
                </div>
                <div className="flex flex-row h-80  justify-around">
                  <div className="overflow-y-scroll">
                    <DynamicInput
                      columns={[
                        { name: 'Numero', atr: 'valor' },
                        { name: 'Puntos', atr: 'posicion' }
                      ]}
                      elements={fichaFormik?.values?.jalones || []}
                      arrayName='jalones'
                      handleChange={fichaFormik.handleChange}
                      clearObject={{ valor: '', posicion: '' }}
                      setTheresChanges={setTheresChangesFicha}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormikProvider>

    </div>
  )
}
export default FrmFichas