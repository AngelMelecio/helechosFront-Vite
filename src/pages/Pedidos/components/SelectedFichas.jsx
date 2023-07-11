import { useEffect, useRef, useState } from "react"
import Input from "../../../components/Input"
import { ICONS } from "../../../constants/icons"

const STATIONS = [
  { name: "Tejido", atr: "tejido" },
  { name: "Plancha", atr: "plancha" },
  { name: "Corte", atr: "corte" },
  { name: "Calidad", atr: "calidad" },
]

const SelectedFichas = ({
  formik,
  onErase,
  pageScrollBottom
}) => {

  const detailsRef = useRef()

  const [fichaHover, setFichaHover] = useState(null)

  const calculateDescription = (cantidad, paquete) => {

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

  //console.log(pageScrollBottom)

  return (
    <>
      {formik?.values.detalles?.length > 0 ?
        <div className="p-2 w-full h-full">
          <div
            ref={detailsRef}
            className={(pageScrollBottom ? "overflow-y-scroll" : "overflow-y-hidden pr-3") + " flex-col w-full h-full absolute bg-slate-100"}>
            {/*  Detalles  */}
            {formik?.values.detalles.map((d, i) =>
              <div className="w-full px-4">
                <div className="bg-white flex w-full rounded-md shadow-md mb-6 " key={"det" + i}>
                  <div className="w-full flex flex-col px-6">
                    {/* CARD HEADER */}
                    <div className="flex relative font-semibold px-2 pt-4 text-teal-700 text-lg">
                      <div
                        onMouseEnter={() => setFichaHover(i)}
                        onMouseLeave={() => setFichaHover(null)}
                        className=" text-teal-700 text-lg">
                        {d.fichaTecnica.nombre}
                      </div>
                      <button onClick={() => onErase(d.fichaTecnica?.idFichaTecnica)}
                        type="button" className="rounded-md neutral-button total-center absolute top-3.5 right-2 w-8 h-8">
                        <ICONS.Trash size="18px" />
                      </button>
                    </div>
                    <div className="relative w-full h-full flex flex-col">

                      <div className={(fichaHover === i ? "blurred" : "") + " w-full flex md:flex-row flex-col relative overflow-x-scroll duration-200"}>
                        {/*  CATIDAD POR TALLA  */}
                        <div className="flex md:w-2/3 w-full">
                          <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300 w-full">
                            <div className="absolute w-full total-center -top-3">
                              <div className='bg-white px-3 font-bold text-teal-700 text-base italic' >
                                Cantidades por talla
                              </div>
                            </div>
                            <table className=" customTable w-full">
                              <thead>
                                <tr >
                                  <th>Talla</th>
                                  <th>Cantidad</th>
                                  <th>C / Paquete</th>
                                  <th>Descripción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {d.cantidades.map((c, j) =>
                                  <tr key={"Can" + j}>
                                    <td className="text-center">
                                      {c.talla}
                                    </td>
                                    {/*  Cantidad  */}
                                    <td>
                                      <input
                                        onChange={e => {
                                          let v = e.target.value
                                          let nC = formik.values.detalles
                                          nC[i].cantidades[j].cantidad = v
                                          formik.setFieldValue('detalles', nC)
                                        }}
                                        className={
                                          (formik.errors[`detalles[${i}].cantidades[${j}].cantidad`] ? "border-rose-400 " : "focus:border-teal-500")
                                          + " border w-full outline-none text-center duration-200"
                                        }
                                        type="number"
                                        value={c.cantidad} />

                                    </td>

                                    {/*  Cantidad por paquete  */}
                                    <td >

                                      <input
                                        onChange={e => {
                                          let v = e.target.value
                                          let nC = formik.values.detalles
                                          nC[i].cantidades[j].paquete = v
                                          formik.setFieldValue('detalles', nC)
                                        }}
                                        className={
                                          (formik.errors[`detalles[${i}].cantidades[${j}].paquete`] ? "border-rose-400 " : "focus:border-teal-500")
                                          + " border w-full outline-none  text-center duration-200"
                                        }
                                        type="number"
                                        value={c.paquete} />

                                    </td>
                                    <td>
                                      {(!formik.errors[`detalles[${i}].cantidades[${j}].cantidad`] && !formik.errors[`detalles[${i}].cantidades[${j}].paquete`]) &&
                                        <p>
                                          {calculateDescription(c.cantidad, c.paquete)}
                                        </p>
                                      }
                                    </td>
                                  </tr>)
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/*  RUTA PRODUCCION  */}
                        <div className="flex md:w-1/3 w-full">
                          <div className="relative px-2 py-4 border-2 mx-2 my-4 border-slate-300 w-full">
                            <div className="absolute w-full total-center -top-3">
                              <div className='bg-white px-3 font-bold text-teal-700 text-base italic' >
                                Ruta de Produccion
                              </div>
                            </div>
                            {
                              STATIONS.map((r, j) => <div className="flex py-1 border-b-2 justify-between w-full" key={"r" + j}>
                                <p className="px-2 text-teal-700">{r.name}</p>
                                <div className="px-2 flex total-center">
                                  <input
                                    onChange={(e) => { formik.setFieldValue(`detalles.${i}.estaciones.${r.atr}`, e.target.checked) }}
                                    checked={d.estaciones[r.atr]}
                                    type="checkbox" />
                                </div>
                              </div>)
                            }
                          </div>
                        </div>
                      </div>

                      {/* DETALLES DE LA FICHA MODAL */}
                      <div className={(fichaHover === i ? "visible" : "") + " modal absolute top-2  w-full z-10 "}>
                        <div className=" w-full h-full rounded-xl text-white grayTrans top-0 shadow-md">

                          {<div className="p-8 flex flex-row w-full total-center">
                            <div className="h-24 w-24 mr-8 rounded-full foto bg-white z-10">
                              <img className="object-cover foto" src={d.fichaTecnica.fotografia} alt="" />
                            </div>
                            <div className="relative px-2 py-4 my-4 flex-1">
                              <div className="absolute w-full total-center -top-3">
                                <div className=' px-3 font-bold text-white text-base italic' >
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
                                    {d.fichaTecnica.materiales.map(m =>
                                      <tr className="border-b-2 text-center">
                                        <td className="flex w-full">
                                          <div className="flex w-full justify-around items-center">
                                            <p>
                                              {m.color}
                                            </p>
                                            <div
                                              style={{ backgroundColor: `${m.codigoColor}` }}
                                              className="h-5 w-5 rounded-full">
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
        <div className="w-full h-full pl-2 pt-2">
          <div className="flex justify-center items-center w-full total-center bg-gray-200 h-full">
            <p className="italic font-semibold text-gray-600 ">
              Seleccione algunas fichas tecnicas ...
            </p>
          </div>
        </div>
      }
    </>)
}

export default SelectedFichas