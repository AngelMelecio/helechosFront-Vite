import { useEffect, useRef, useState } from "react"
import Input from "../../../components/Input"
import { ICONS } from "../../../constants/icons"
import FieldsBox from "../../../components/FieldsBox"

const STATIONS = [
  { name: "Tejido", atr: "tejido" },
  { name: "Plancha", atr: "plancha" },
  { name: "Calidad", atr: "calidad" },
  { name: "Corte", atr: "corte" },
]

const SelectedFichas = ({
  formik,
  onErase,
  pageScrollBottom
}) => {

  const detailsRef = useRef()

  const [fichaHover, setFichaHover] = useState(null)

  const calculateDescription = (cantidad, paquete) => {
    if (Number(paquete) === 0) return <></>
    let paquetes = Math.floor(cantidad / paquete)
    let sobrante = cantidad % paquete
    let descripcion = ""
    descripcion += paquetes + " paquetes de " + paquete
    if (sobrante) descripcion += " y un paquete de " + sobrante
    return (paquetes ? <>{descripcion}</> : <></>)
  }
  useEffect(() => {
    if (!pageScrollBottom) {
      detailsRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pageScrollBottom])

  return (
    <>
      {formik?.values.detalles?.length > 0 ?
        <div className="w-full h-full p-2">
          <div
            ref={detailsRef}
            className={(pageScrollBottom ? "overflow-y-scroll" : "overflow-y-hidden pr-3") + " flex-col w-full h-full absolute bg-slate-100"}>
            {/*  Detalles  */}
            {formik?.values.detalles.map((d, i) =>
              <div className="w-full p-4" key={i}>
                <div className="flex w-full bg-white rounded-md shadow-md " key={"det" + i}>
                  <div className="flex flex-col w-full ">
                    {/* CARD HEADER */}
                    <div className="relative flex items-center justify-between p-4">
                      <div
                        onMouseEnter={() => setFichaHover(i)}
                        onMouseLeave={() => setFichaHover(null)}
                        className="pl-2 text-base font-bold text-teal-800/80">
                        {d.fichaTecnica.nombre}
                      </div>
                      <button onClick={() => onErase(d.fichaTecnica?.idFichaTecnica)}
                        type="button" className="w-8 h-8 rounded-md neutral-button total-center">
                        <ICONS.Trash size="18px" />
                      </button>
                    </div>

                    <div className="relative flex w-full h-full px-4 pb-4">

                      <div className={(fichaHover === i ? "blurred" : "") + " w-full flex md:flex-row flex-col relative  duration-200"}>
                        {/*  CATIDAD POR TALLA  */}
                        <div className="flex w-full md:w-2/3">
                          <FieldsBox title="Cantidades por talla">
                            <table className="w-full ">
                              <thead className="text-sm font-medium text-teal-800/80">
                                <tr key={'tr-main' + i}>
                                  <th>Talla</th>
                                  <th>Cantidad</th>
                                  <th>C / Paquete</th>
                                  <th>Descripción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {d.cantidades.map((c, j) =>
                                  <tr key={"can" + i + '-' + j}>
                                    <td className="font-medium text-center text-gray-500">
                                      {c.talla}
                                    </td>
                                    {/*  Cantidad  */}
                                    <td>
                                      <input
                                        onWheel={(e) =>  e.target.blur() }
                                        onChange={e => {
                                          let v = e.target.value
                                          let nC = formik.values.detalles
                                          nC[i].cantidades[j].cantidad = v
                                          formik.setFieldValue('detalles', nC)
                                        }}
                                        className={
                                          (formik.errors[`detalles[${i}].cantidades[${j}].cantidad`] ? "border-rose-400 " : "focus:border-teal-400 focus:ring-2 focus:ring-teal-300 hover:border-teal-400 ")
                                          + " border h-8 rounded-md w-full outline-none text-center  text-gray-800 font-medium duration-200"
                                        }
                                        type="number"
                                        value={c.cantidad} />

                                    </td>

                                    {/*  Cantidad por paquete  */}
                                    <td >

                                      <input
                                        onWheel={(e) =>  e.target.blur() }
                                        onChange={e => {
                                          let v = e.target.value
                                          let nC = formik.values.detalles
                                          nC[i].cantidades[j].paquete = v
                                          formik.setFieldValue('detalles', nC)
                                        }}
                                        className={
                                          (formik.errors[`detalles[${i}].cantidades[${j}].paquete`] ? "border-rose-400 " : "focus:border-teal-400 focus:ring-2 focus:ring-teal-300 hover:border-teal-400 ")
                                          + " border h-8 rounded-md w-full outline-none text-center  text-gray-800 font-medium duration-200"
                                        }
                                        type="number"
                                        value={c.paquete} />

                                    </td>
                                    <td>
                                      {(!formik.errors[`detalles[${i}].cantidades[${j}].cantidad`] && !formik.errors[`detalles[${i}].cantidades[${j}].paquete`]) &&
                                        <p className="px-2 font-medium text-gray-500">
                                          {calculateDescription(c.cantidad, c.paquete)}
                                        </p>
                                      }
                                    </td>
                                  </tr>)
                                }
                              </tbody>
                            </table>
                          </FieldsBox>

                        </div>
                        {/*  RUTA PRODUCCION  */}
                        <div className="flex w-full md:w-1/3">
                          <FieldsBox title="Ruta de producción">
                            {
                              STATIONS.map((r, j) => <div className="flex justify-between w-full py-1 border-b-2" key={"r" + j}>
                                <p className="px-2 font-medium text-gray-700">{r.name}</p>
                                <div className="flex px-2 total-center">
                                  <input
                                    onChange={(e) => { formik.setFieldValue(`detalles.${i}.estaciones.${r.atr}`, e.target.checked) }}
                                    checked={d.estaciones[r.atr]}
                                    type="checkbox" />
                                </div>
                              </div>)
                            }
                          </FieldsBox>

                        </div>
                      </div>

                      {/* DETALLES DE LA FICHA MODAL */}
                      <div className={(fichaHover === i ? "visible" : "") + " modal absolute top-2  w-full z-10 "}>
                        <div className="top-0 w-full h-full text-white shadow-md rounded-xl grayTrans">

                          {<div className="flex flex-row w-full p-8 total-center">
                            <div className="z-10 w-24 h-24 mr-8 bg-white rounded-full foto">
                              <img className="object-cover foto" src={d.fichaTecnica.fotografia} alt="" />
                            </div>
                            <div className="relative flex-1 px-2 py-4 my-4">
                              <div className="absolute w-full total-center -top-3">
                                <div className='px-3 text-base italic font-bold text-white ' >
                                  Materiales
                                </div>
                              </div>
                              <div className="w-full">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b-2">
                                      <th className="px-2">Color</th>
                                      <th className="px-2">Proveedor</th>
                                      <th className="px-2">Teñida</th>
                                      <th className="px-2">Código</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {d.fichaTecnica.materiales.map((m, k) =>
                                      <tr className="text-center border-b-2" key={'ftm' + k}>
                                        <td className="flex w-full">
                                          <div className="flex items-center justify-around w-full">
                                            <p>
                                              {m.color}
                                            </p>
                                            <div
                                              style={{ backgroundColor: `${m.codigoColor}` }}
                                              className="w-5 h-5 rounded-full">
                                            </div>
                                          </div>
                                        </td>
                                        <td>{m.proveedor.nombre}</td>
                                        <td>{m.tenida}</td>
                                        <td>{m.codigoColor}</td>
                                      </tr>)
                                    }
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>}

                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>)}
          </div>
        </div>
        :
        <div className="w-full h-full pt-2 pl-2">
          <div className="flex items-center justify-center w-full h-full bg-gray-200 total-center">
            <p className="italic font-semibold text-gray-600 ">
              Seleccione algunas fichas tecnicas ...
            </p>
          </div>
        </div>
      }
    </>)
}

export default SelectedFichas