import { useFormik, FormikProvider } from "formik"
import { useEffect } from "react"
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
import { useParams } from "react-router-dom";
import { useDetailModelos } from "../hooks/useDetailModelos";
import { useFichaMateriales } from "../hooks/useFichaMateriales";
import { useAuth } from "../../../context/AuthContext";
import FieldsBox from "../../../components/FieldsBox";
import Inpt from "../../../components/Inputs/Inpt";
import OptsInpt from "../../../components/Inputs/OptsInpt";

const FrmFichas = ({
  ficha,
}) => {
  const { notify } = useAuth()
  const { id } = useParams()
  const formRef = useRef(null)


  const { allMaquinas, refreshMaquinas } = useMaquinas()
  const [tejidoOptions, setTejidoOptions] = useState([])
  const [planchaOptions, setPlanchaOptions] = useState([])

  const {
    theresChangesFicha, setTheresChangesFicha,
    theresChangesMateriales, setTheresChangesMateriales,
    pageScrollBottom,
    setSelectedFichaIndx,
    setSaving,
  } = useDetailModelos()

  const {
    refreshFichaMateriales,
    allFichaMateriales,
    fetchingFichaMateriales,
  } = useFichaMateriales()

  const {
    postFicha,
    saveFichaMateriales,
  } = useFichas()

  const validate = values => {
    const errors = {};
    const regex = /^(\d+(\.\d+)?(\/(?=\d))?)+$/;

    if (!values.talla) {
      errors.talla = 'Ingresa la talla';
    } else if (!regex.test(values.talla)) {
      errors.talla = "Las tallas no coincide con el patrón";
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

      try {
        setSaving(true)
        let idFicha = ficha.idFichaTecnica
        if (theresChangesFicha) {
          const { ficha: newFicha, message } = await postFicha({
            values: { ...values, modelo: id },
            method: ficha.idFichaTecnica ? 'PUT' : 'POST'
          })
          idFicha = newFicha.idFichaTecnica
          setSelectedFichaIndx(null)
          setTheresChangesFicha(false)
          notify(message)
        }
        if (theresChangesMateriales || ficha.copied) {
          const { message } = await saveFichaMateriales({
            idFichaTecnica: idFicha,
            materiales: values.materiales
          })
          setSelectedFichaIndx(null)
          setTheresChangesMateriales(false)
          notify(message)
        }
      } catch (e) {
        //console.log(e)
      } finally {
        setSaving(false)
      }
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
        .map(m => ({ value: m.idMaquina.toString(), label: ((m.linea !== '0') ? 'L' + m.linea + ' - ' : '') + 'M' + m.numero }))
    )
    setPlanchaOptions(
      allMaquinas
        .filter(m => (m.departamento === 'Plancha'))
        .map(m => ({ value: m.idMaquina.toString(), label: ((m.linea !== '0') ? 'L' + m.linea + ' - ' : '') + 'M' + m.numero }))
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
          className='relative flex flex-col w-full h-full '>
          <div className="absolute flex flex-col w-full p-4">
            <div className="flex w-full">
              <FieldsBox title="Información de la ficha">
                <div className="w-full py-2 total-center">
                  <div className="relative flex items-center justify-center w-full text-center foto">
                    { /* Imagen del Modelo */}
                    {(toUrl(fichaFormik.values?.fotografia) !== null) && <img
                      className='object-cover foto'
                      src={toUrl(fichaFormik.values?.fotografia)}
                      alt='' />}
                    <input id='file' type="file" name='fotografia' accept='image/*'
                      onChange={handleSelectFile} className='inputfile' />
                    <label
                      className='absolute p-2 rounded-full -bottom-2 -right-1 normal-button'
                      htmlFor='file' >
                      <ICONS.Upload style={{ color: 'white' }} size='18px' />
                    </label>
                  </div>
                </div>

                <div className='flex flex-row w-full'>
                  <Inpt
                    label="Nombre de la Ficha"
                    name="nombre"
                    type="text"
                    formik={fichaFormik}
                    onKeyDown={() => setTheresChangesFicha(true)}
                  />
                </div>

                <div className="flex flex-row w-full gap-6">
                  <Inpt
                    label="Talla"
                    name="talla"
                    type="text"
                    formik={fichaFormik}
                    onKeyDown={() => setTheresChangesFicha(true)}
                  />
                  <Inpt
                    label="Nombre del Programa"
                    name="nombrePrograma"
                    type="text"
                    formik={fichaFormik}
                    onKeyDown={() => setTheresChangesFicha(true)}
                  />
                </div>
                <div className="flex flex-row w-full gap-6">
                  <Inpt
                    readOnly
                    label='Fecha de Creación'
                    type='text'
                    name='fechaCreacion'
                    formik={fichaFormik}
                  />
                  <Inpt
                    readOnly
                    label='Ultima Modificación' type='text' name='fechaUltimaEdicion'
                    formik={fichaFormik}
                  />

                </div>
              </FieldsBox>
            </div>
            <div className="flex w-full">
              <FieldsBox title="Datos del tejido">
                <div className="flex flex-row w-full gap-6">
                  <div className="flex flex-row w-full gap-6">
                    <OptsInpt
                      label="Máquina Tejido"
                      name="maquinaTejido"
                      formik={fichaFormik}
                      options={tejidoOptions}
                      fieldChange={() => setTheresChangesFicha(true)}
                      placeholder="Seleccione"
                    />
                    <Inpt
                      label="Tipo Maquina Tejido"
                      name="tipoMaquinaTejido"
                      type="text"
                      formik={fichaFormik}
                      onKeyDown={() => setTheresChangesFicha(true)}
                    />
                  </div>
                  <div className="flex flex-row w-full gap-6">
                    <Inpt
                      label="Galga"
                      name="galga"
                      type="text"
                      formik={fichaFormik}
                      onKeyDown={() => setTheresChangesFicha(true)}
                    />
                    <Inpt
                      label="Velocidad"
                      name="velocidadTejido"
                      type="text"
                      formik={fichaFormik}
                      onKeyDown={() => setTheresChangesFicha(true)}
                    />
                    <Inpt
                      label="Tiempo de bajada"
                      name="tiempoBajada"
                      type="text"
                      formik={fichaFormik}
                      onKeyDown={() => setTheresChangesFicha(true)}
                    />

                  </div>
                </div>
              </FieldsBox>
            </div>
            <div className="flex w-full">
              <FieldsBox title="Datos de la plancha">
                <div className="flex flex-row w-full gap-6">
                  <div className="flex flex-row w-full gap-6">
                    <OptsInpt
                      label="Máquina de Plancha"
                      name='maquinaPlancha'
                      formik={fichaFormik}
                      options={planchaOptions}
                      fieldChange={() => setTheresChangesFicha(true)}
                      placeholder="Seleccione"
                    />
                  </div>
                  <div className="flex flex-row w-full gap-6">
                    <Inpt
                      label="Velocidad"
                      name='velocidadPlancha'
                      type='text'
                      formik={fichaFormik}
                      onKeyDown={() => setTheresChangesFicha(true)}
                    />
                    <Inpt
                      label="Temperatura"
                      name='temperaturaPlancha'
                      type='text'
                      formik={fichaFormik}
                      onKeyDown={() => setTheresChangesFicha(true)}
                    />
                  </div>
                </div>
              </FieldsBox>
            </div>
            <div className="flex w-full">
              <FieldsBox title="Datos de los hilos">
                {!fetchingFichaMateriales && fichaFormik?.values?.materiales ?
                  <>
                    <PesosList
                      materiales={fichaFormik?.values?.materiales}
                    />
                    <div className="flex flex-row w-full">
                      {<SelectorMateriales
                        fichaTecnicaObj={fichaFormik}
                        onPassMateriales={onPassMateriales}
                        setTheresChanges={setTheresChangesMateriales}
                      />}
                    </div>
                  </>
                  :
                  <Loader />
                }
              </FieldsBox>
            </div>


            <div className="flex">

              <FieldsBox title="Número" className="h-80" vertical >

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

              </FieldsBox>
              <FieldsBox title="Economisadores" className="h-80" vertical >

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


              </FieldsBox>
              <FieldsBox title="Jalones" className="h-80" vertical >

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

              </FieldsBox>


            </div>
          </div>
        </form>
      </FormikProvider>

    </div>
  )
}
export default FrmFichas