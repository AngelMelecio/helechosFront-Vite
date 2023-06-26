import { useState } from "react"
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
  onErase
}) => {

  const [fichaHover, setFichaHover] = useState(null)

  const calculateDescription = (cantidad, paquete) => {

    let paquetes = Math.floor(cantidad / paquete)
    let sobrante = cantidad % paquete
    let descripcion = ""
    descripcion += paquetes + " paquetes de " + paquete
    if (sobrante) descripcion += " y un paquete de " + sobrante
    return (paquetes ? <>{descripcion}</> : <></>)
  }

  return (
    <>
      {formik?.values.detalles?.length > 0 &&
        <div className="flex-col w-full h-full absolute overflow-y-scroll bg-gray-50 p-2">
          {/*  Detalles  */}
          {formik?.values.detalles.map((d, i) =>
            <div className="bg-white flex w-full shadow-md mb-2 " key={"det" + i}>
              <div className="w-full flex flex-col">
                <div className="flex relative font-semibold px-4 py-2 text-teal-800 text-lg">
                  <div
                    onMouseEnter={() => setFichaHover(i)}
                    onMouseLeave={() => setFichaHover(null)}
                    className=" text-teal-800 text-lg">
                    {d.fichaTecnica.nombre}
                  </div>
                  <button onClick={() => onErase(d.fichaTecnica?.idFichaTecnica)}
                    type="button" className="rounded-md neutral-button total-center absolute top-1.5 right-4 w-8 h-8">
                    <ICONS.Trash size="18px" />
                  </button>
                </div>
                <div className="relative w-full h-full flex flex-col">
                  <div className={(fichaHover === i ? "blurred" : "") + " w-full flex flex-col relative overflow-x-scroll duration-200"}>

                    <div className="w-full px-4 py-2">
                      <table>
                        <thead>
                          <tr>
                            <th className="p-2 text-teal-800 text-base whitespace-nowrap">Talla</th>
                            <th className="p-2 text-teal-800 text-base whitespace-nowrap">Cantidad</th>
                            <th className="p-2 text-teal-800 text-base whitespace-nowrap">C / Paquete</th>
                            <th className="p-2 text-teal-800 text-base whitespace-nowrap">Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {d.cantidades.map((c, j) =>
                            <tr key={"Can" + j}>
                              <td className="text-center">
                                {c.talla}
                              </td>
                              {/*  Cantidad  */}
                              <td >
                                <input
                                  onChange={e => {
                                    let v = e.target.value
                                    let nC = formik.values.detalles
                                    nC[i].cantidades[j].cantidad = v
                                    formik.setFieldValue('detalles', nC)
                                  }}
                                  className={
                                    (formik.errors[`detalles[${i}].cantidades[${j}].cantidad`] ? "border-rose-400 " : "focus:border-teal-500")
                                    + " border w-full outline-none bg-gray-100 text-center duration-200"
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
                                    + " border w-full outline-none bg-gray-100 text-center duration-200"
                                  }
                                  type="number"
                                  value={c.paquete} />

                              </td>
                              <td>
                                {(!formik.errors[`detalles[${i}].cantidades[${j}].cantidad`] && !formik.errors[`detalles[${i}].cantidades[${j}].paquete`]) &&
                                  <p className="text-teal-800 text-base whitespace-nowrap px-2">
                                    {calculateDescription(c.cantidad, c.paquete)}
                                  </p>
                                }
                              </td>
                            </tr>)
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-2 flex flex-col">
                      <p className="text-teal-800 text-base py-1 font-bold">Ruta de Produccion</p>
                      {
                        STATIONS.map((r, j) => <div className="flex py-1 w-36 justify-between" key={"r" + j}>
                          <p className="px-2 text-teal-800">{r.name}</p>
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
                  <div className={(fichaHover === i ? "visible" : "") + " modal absolute top-0 grayTrans h-full w-full rounded-xl text-white "}>
                    <div className="p-4 flex flex-col">
                      <div className="h-24 w-24 mb-2 rounded-full foto bg-white">
                        <img className="object-cover foto" src={d.fichaTecnica.fotografia} alt="" />
                      </div>
                      <div className="font-semibold text-teal-200 text-xl">
                        Materiales
                      </div>
                      <div>
                        <table>
                          <thead>
                            <tr>
                              <th className="px-2">Color</th>
                              <th className="px-2">Proveedor</th>
                              <th className="px-2">Teñida</th>
                              <th className="px-2">Código</th>
                            </tr>
                          </thead>
                          <tbody>
                            {d.fichaTecnica.materiales.map(m =>
                              <tr>
                                <td>
                                  <div className="flex items-center">
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
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      }

    </>)
}

export default SelectedFichas