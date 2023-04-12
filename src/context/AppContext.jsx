import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./AuthContext";
import { entorno } from "../constants/entornos.jsx"

const AppContext = React.createContext()

export function useApp() {
  return useContext(AppContext)
}

const apiProveedoresUrl = entorno + "/api/proveedores/"
const apiEmpleadosUrl = entorno + "/api/empleados/"
const apiMaquinasUrl = entorno + "/api/maquinas/"
const apiClientesUrl = entorno + "/api/clientes/"
const apiEmpleadoMaquinaUrl = entorno + "/api/empleados_maquina/"
const apiModeloMaterialUrl = entorno + "/api/modelo_material/"
const apiEmpleadoMaquinasUrl = entorno + "/api/empleado_maquinas/"
const apiMaterialesUrl = entorno + "/api/materiales/"
const apiModelosUrl = entorno + "/api/modelos/"
const imageEndPoint = entorno

const empleadosColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'Apellidos', attribute: 'apellidos' },
  { name: 'Dirección', attribute: 'direccion' },
  { name: 'Seguro Social', attribute: 'ns' },
  { name: 'Fecha de Contratación', attribute: 'fechaEntrada' },
  { name: 'Fecha Alta de Seguro', attribute: 'fechaAltaSeguro' },
  { name: 'Estado', attribute: 'estado' },
  { name: 'Teléfono', attribute: 'telefono' },
  { name: 'Departamento', attribute: 'departamento' },
]

const maquinasColumns = [
  { name: 'Número', attribute: 'numero' },
  { name: 'Línea', attribute: 'linea' },
  { name: 'Marca', attribute: 'marca' },
  { name: 'Modelo', attribute: 'modelo' },
  { name: 'Número de Serie', attribute: 'ns' },
  { name: 'Otros', attribute: 'otros' },
  { name: 'Fecha de Adquisición', attribute: 'fechaAdquisicion' },
  { name: 'Detalle Adquisición', attribute: 'detalleAdquisicion' },
  { name: 'Departamento', attribute: 'departamento' },
]

const clientesColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'RFC', attribute: 'rfc' },
  { name: 'Dirección', attribute: 'direccion' },
  { name: 'Teléfono', attribute: 'telefono' },
  { name: 'Correo', attribute: 'correo' },
  { name: 'Otro', attribute: 'otro' },
]

const proveedoresColumns = [
  { name: 'Nombre', attribute: 'nombre' },
  { name: 'RFC', attribute: 'rfc' },
  { name: 'Dirección', attribute: 'direccion' },
  { name: 'Teléfono', attribute: 'telefono' },
  { name: 'Correo', attribute: 'correo' },
  { name: 'Departamento', attribute: 'departamento' },
  { name: 'Otro', attribute: 'otro' },
]

const materialesColumns = [
  { name: 'Tipo', attribute: 'tipo' },
  { name: 'Color', attribute: 'color' },
  { name: 'Calibre', attribute: 'calibre' },
  { name: 'Proveedor', attribute: 'nombreProveedor' },
  { name: 'Teñida', attribute: 'tenida' },
  { name: 'Código de color', attribute: 'codigoColor' },
]

export function AppProvider({ children }) {

  const { session, notify } = useAuth()

  const [fetchingEmpleados, setFetchingEmpleados] = useState(false)
  const [allEmpleados, setAllEmpleados] = useState([])

  const [fetchingMaquinas, setFetchingMaquinas] = useState(false)
  const [fetchingModelos, setFetchingModelos] = useState(false)

  const [allMaquinas, setAllMaquinas] = useState([])

  const [fetchingClientes, setFetchingClientes] = useState(false)
  const [allClientes, setAllClientes] = useState([])

  const [fetchingProveedores, setFetchingProveedores] = useState(false)
  const [allProveedores, setAllProveedores] = useState([])
  
  const [fetchingMateriales, setFetchingMateriales] = useState(false)

  const [allMateriales, setAllMateriales] = useState([])

  const [allModelos, setAllModelos] = useState([])

  const getEmpleados = async () => {
    setFetchingEmpleados(true)
    let response = await fetch(apiEmpleadosUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let data = await response.json()
      let formatData = data.map((empl) => ({
        ...empl,
        isSelected: false,
        estado: empl.is_active ? "Activo" : 'Inactivo',
        fotografia: empl.fotografia ? imageEndPoint + empl.fotografia : ''
      }))
      setAllEmpleados(formatData)
      setFetchingEmpleados(false)
      return formatData
    }
    setFetchingEmpleados(false)
  }

  const saveEmpleado = async (values, objEmpleado, maquinas, isEdit) => {
    let formData = new FormData()
    formData.append('nombre', values.nombre)
    formData.append('apellidos', values.apellidos)
    formData.append('direccion', values.direccion)
    formData.append('telefono', values.telefono)
    formData.append('ns', values.ns)
    if ((objEmpleado.fotografia) instanceof File)
      formData.append('fotografia', objEmpleado.fotografia)
    formData.append('departamento', values.departamento)
    formData.append('is_active', values.is_active)
    values.fechaEntrada !== null && formData.append('fechaEntrada', values.fechaEntrada)
    values.fechaAltaSeguro !== null && formData.append('fechaAltaSeguro', values.fechaAltaSeguro)

    let maquinasIds = []
    maquinas.forEach(m => maquinasIds.push({ id: m.idMaquina }))

    if (!isEdit) {
      //    Creacion de un Nuevo Empleado 
      let response = await fetch(apiEmpleadosUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + session.access }
      })
      //    Espero la respuesta para obtener el nuevo Id 
      const { message, empleado } = await response.json()
      notify(message)
      if (maquinas.length === 0) return
      if (response.ok) {
        //    Asigno las Maquinas 
        let response2 = await fetch(apiEmpleadoMaquinasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.access
          },
          body: JSON.stringify({ idEmpleado: empleado.idEmpleado, maquinas: maquinasIds }),
        })
        let error = response2.ok ? false : true
        let data = await response2.json()
        notify(data.message, error)
      }
    }
    else {
      //    Actaulizo los datos del Empleado
      await fetch(apiEmpleadosUrl + values.idEmpleado, {
        method: 'PUT',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + session.access }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

      if (maquinas.length === 0) return

      //    Asigno Sus nuevas maquinas
      let response = await fetch(apiEmpleadoMaquinasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session.access
        },
        body: JSON.stringify({ idEmpleado: values.idEmpleado, maquinas: maquinasIds }),
      })
      let data = await response.json()
      notify(data.message)
    }
  }

  const deleteEmpleados = async (listaEmpleados) => {
    for (let i = 0; i < listaEmpleados.length; i++) {
      let e = listaEmpleados[i]
      if (e.isSelected) {
        let response = await fetch(apiEmpleadosUrl + e.idEmpleado, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
        }
        else
          notify(data.message, true)
      }
    }
  }

  const getModeloMaterial = async (idModelo) => {
    let response = await fetch(apiModeloMaterialUrl + idModelo, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let assigned = await response.json()
      let materialesformated =[]
      if(assigned.length>0){
        assigned.map((mm) => {
          materialesformated.push({
            peso: mm.peso,
            tipo: mm.material.tipo,
            color: mm.material.color,
            codigoColor: mm.material.codigoColor,
            tenida: mm.material.tenida,
            hebras: mm.hebras,
            calibre: mm.material.calibre,
            guiaHilos: mm.guiaHilos,
            nombreProveedor: mm.material.proveedor.nombre,
            idMaterial: mm.material.idMaterial
          })
        });
      }
      return materialesformated
    }
    return []
  }

  const getEmpleadoMaquinas = async (empId) => {
    let response = await fetch(apiEmpleadoMaquinaUrl + empId, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let assigned = await response.json()
      return assigned
    }
    return []
  }

  const getMaquinas = async () => {
    setFetchingMaquinas(true)
    let response = await fetch(apiMaquinasUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let maquinas = await response.json()
      let formatData = maquinas.map((mqna) => ({
        ...mqna,
        isSelected: false,
      }))
      setAllMaquinas(formatData)
      return formatData
    }
    setFetchingMaquinas(false)
  }

  const saveMaquina = async (values, isEdit) => {

    let formData = new FormData()
    formData.append('numero', values.numero)
    formData.append('linea', values.linea)
    formData.append('marca', values.marca)
    formData.append('modelo', values.modelo)
    formData.append('ns', values.ns)
    formData.append('otros', values.otros)
    formData.append('fechaAdquisicion', values.fechaAdquisicion)
    formData.append('detalleAdquisicion', values.detalleAdquisicion)
    formData.append('departamento', values.departamento)

    if (!isEdit) {
      //Creacion de un nueva maquina 
      await fetch(apiMaquinasUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

    } else {
      //Actualizando los datos de la maquina
      await fetch(apiMaquinasUrl + values.idMaquina, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))
    }
  }

  const deleteMaquinas = async (listaMaquinas) => {
    for (let i = 0; i < listaMaquinas.length; i++) {
      let e = listaMaquinas[i]
      if (e.isSelected) {
        let response = await fetch(apiMaquinasUrl + e.idMaquina, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
        } else
          notify(data.message, true)
      }
    }
  }

  const getClientes = async () => {
    setFetchingClientes(true)
    let response = await fetch(apiClientesUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let clientes = await response.json()

      let formatData = clientes.map((cliente) => ({
        ...cliente,
        isSelected: false,
      }))

      setAllClientes(formatData)
      return formatData
    }
    setFetchingClientes(false)
  }

  const saveCliente = async (values, isEdit) => {

    let formData = new FormData()
    formData.append('nombre', values.nombre)
    formData.append('direccion', values.direccion)
    formData.append('rfc', values.rfc)
    formData.append('telefono', values.telefono)
    formData.append('correo', values.correo)
    formData.append('contactos', JSON.stringify(values.contactos))
    formData.append('otro', values.otro)


    if (!isEdit) {
      //Creacion de un nueva maquina 
      await fetch(apiClientesUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

    } else {
      //Actualizando los datos de la maquina
      await fetch(apiClientesUrl + values.idCliente, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))
    }
  }

  const deleteClientes = async (listaClientes) => {
    for (let i = 0; i < listaClientes.length; i++) {
      let e = listaClientes[i]
      if (e.isSelected) {
        let response = await fetch(apiClientesUrl + e.idCliente, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
        } else
          notify(data.message, true)
      }
    }
  }

  const getProveedores = async () => {
    setFetchingProveedores(true)
    let response = await fetch(apiProveedoresUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let proveedores = await response.json()

      let formatData = proveedores.map((proveedor) => ({
        ...proveedor,
        isSelected: false,
      }))

      setAllProveedores(formatData)
      return formatData
    }
    setFetchingProveedores(false)
  }

  const saveProveedor = async (values, isEdit) => {

    let formData = new FormData()
    Object.keys(values).forEach(key => {
      let val = values[key]
      if (Array.isArray(values[key])) val = JSON.stringify(values[key])
      formData.append(key + '', val)
    })

    if (!isEdit) {
      //Creacion de un nueva maquina 
      await fetch(apiProveedoresUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

    } else {
      //Actualizando los datos de la maquina
      await fetch(apiProveedoresUrl + values.idProveedor, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))
    }
  }

  const deleteProveedores = async (listaProveedores) => {
    for (let i = 0; i < listaProveedores.length; i++) {
      let e = listaProveedores[i]
      if (e.isSelected) {
        let response = await fetch(apiProveedoresUrl + e.idProveedor, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
        } else
          notify(data.message, true)
      }
    }
  }

  const getMateriales= async () => {
    setFetchingMateriales(true)
    let response = await fetch(apiMaterialesUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.access
      }
    })
    if (response.status === 200) {
      let materiales = await response.json()
      
      let formatData = materiales.map((material) => ({
        ...material,
        isSelected: false,
        count: 0,
        idProveedor:material.proveedor.idProveedor.toString(),
        nombreProveedor:material.proveedor.nombre
      }))
      
      setAllMateriales(formatData)
      return formatData
    }
    setFetchingMateriales(false)
  }

  const saveMaterial = async (values, isEdit) => {

    let formData = new FormData()
    formData.append('tipo', values.tipo)
    formData.append('color', values.color)
    formData.append('codigoColor', values.codigoColor)
    formData.append('calibre', values.calibre)
    formData.append('proveedor', values.idProveedor)
    formData.append('tenida', values.tenida)
    

    if (!isEdit) {
      //Creacion de un nuevo Material 
      await fetch(apiMaterialesUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

    } else {
      //Actualizando los datos del Material
      await fetch(apiMaterialesUrl + values.idMaterial, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + session.access
        }
      })
        .then(response => response.json())
        .then(data => notify(data.message))
    }
  }

  const deleteMateriales = async (listaMateriales) => {
    for (let i = 0; i < listaMateriales.length; i++) {
      let e = listaMateriales[i]
      if (e.isSelected) {
        let response = await fetch(apiMaterialesUrl + e.idMaterial, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
        } else
          notify(data.message, true)
      }
    }
  }

  const saveModelo = async (values, isEdit) => {
    /*Object.keys(values).forEach(k => {
      if (k !== 'idModelo') {
        let val = Array.isArray(values[k]) ? JSON.stringify(values[k]) : (values[k] === null ? "" : values[k])
        formData.append(k + '', val)
      }
    })*/
    let formData = new FormData()
    formData.append('nombre', values.nombre !== null ? values.nombre : '')
    formData.append('nombrePrograma', values.nombrePrograma !== null ? values.nombrePrograma : '')
    if ((values.archivoPrograma) instanceof File)
      formData.append('archivoPrograma', values.archivoPrograma !== null ? values.archivoPrograma : '')
    if ((values.archivoFichaTecnica) instanceof File)
      formData.append('archivoFichaTecnica', values.archivoFichaTecnica !== null ? values.archivoFichaTecnica : '')
    if ((values.fotografia) instanceof File)
      formData.append('fotografia', values.fotografia !== null ? values.fotografia : '')
    formData.append('cliente', values.idCliente !== null ? values.idCliente : '')
    formData.append('talla', values.talla !== null ? values.talla : '')
    formData.append('maquinaTejido', values.idMaquinaTejido !== null ? values.idMaquinaTejido : '')
    formData.append('tipoMaquinaTejido', values.tipoMaquinaTejido !== null ? values.tipoMaquinaTejido : '')
    formData.append('galga', values.galga !== null ? values.galga : '')
    formData.append('velocidadTejido', values.velocidadTejido !== null ? values.velocidadTejido : '')
    formData.append('tiempoBajada', values.tiempoBajada !== null ? values.tiempoBajada : '')
    formData.append('maquinaPlancha', values.idMaquinaPlancha !== null ? values.idMaquinaPlancha : '')
    formData.append('velocidadPlancha', values.velocidadPlancha !== null ? values.velocidadPlancha : '')
    formData.append('temperaturaPlancha', values.temperaturaPlancha !== null ? values.temperaturaPlancha : '')
    formData.append('pesoPoliester', values.pesoPoliester !== null ? values.pesoPoliester : '')
    formData.append('pesoMelt', values.pesoMelt !== null ? values.pesoMelt : '')
    formData.append('pesoLurex', values.pesoLurex !== null ? values.pesoLurex : '')
    //formData.append('materiales', JSON.stringify(values.materiales))
    formData.append('numeroPuntos', JSON.stringify(values.numeroPuntos))
    formData.append('jalones', JSON.stringify(values.jalones))
    formData.append('economisadores', JSON.stringify(values.economisadores))
    formData.append('otros', values.otros !== null ? values.otros : '')

    let materialesmm = values.materiales
    if (!isEdit) {
      //    Creacion de un Nuevo Modelo 
      let response = await fetch(apiModelosUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + session.access }
      })
      //    Espero la respuesta para obtener el nuevo Id 
      const { message, modelo } = await response.json()
      notify(message)
      if (materialesmm.length === 0) return
      if (response.ok) {
        //    Asigno los materiales 
        let response2 = await fetch(apiModeloMaterialUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + session.access
          },
          body: JSON.stringify({ idModelo: modelo.idModelo, materiales: materialesmm }),
        })
        let error = response2.ok ? false : true
        let data = await response2.json()
        notify(data.message, error)
      }
    }
    else {
      //    Actualizo los datos del Modelo
      await fetch(apiModelosUrl + values.idModelo, {
        method: 'PUT',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + session.access }
      })
        .then(response => response.json())
        .then(data => notify(data.message))

      if (materialesmm.length === 0) return

      //    Asigno Sus nuevas maquinas
      let response = await fetch(apiModeloMaterialUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session.access
        },
        body: JSON.stringify({ idModelo: values.idModelo, materiales: materialesmm }),
      })
      let data = await response.json()
      notify(data.message)
    }
  }

  const deleteModelos = async (listaModelos) => {
    for (let i = 0; i < listaModelos.length; i++) {
      let e = listaModelos[i]
      if (e.isSelected) {
        let response = await fetch(apiModelosUrl + e.idModelo, {
          method: 'DELETE',
          headers: {
            "authorization": "Bearer " + session.access
          }
        })
        let data = await response.json()
        if (response.ok) {
          notify(data.message)
        }
        else
          notify(data.message, true)
      }
    }
  }

  const getModelos = async () => {
    await fetch(apiModelosUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + session.access
      }
    }).then(response => response.json())
      .then(data => {
        
        let formatData = []
        data.forEach(async (m) => {
          
          formatData.push({
            ...m,
            isSelected: false,
            fotografia: m.fotografia ? imageEndPoint + m.fotografia : '',
            archivoPrograma: m.archivoPrograma ? imageEndPoint + m.archivoPrograma : '',
            archivoFichaTecnica: m.archivoFichaTecnica ? imageEndPoint + m.archivoFichaTecnica : '',
            idCliente: m.cliente.idCliente.toString(),
            nombreCliente: m.cliente.nombre,

            idMaquinaTejido: m.maquinaTejido.idMaquina.toString(),
            nombreMaquinaTejido: 'Línea: '+m.maquinaTejido.linea+' Número: '+m.maquinaTejido.numero,

            idMaquinaPlancha: m.maquinaPlancha.idMaquina.toString(),
            nombreMaquinaPlancha: 'Línea: '+m.maquinaPlancha.linea+' Número: '+m.maquinaPlancha.numero,

            materiales: await getModeloMaterial(m.idModelo)
          })
        })
        setAllModelos(formatData)
        console.log(formatData)
      })
  }

  return (
    <AppContext.Provider
      value={{
        fetchingEmpleados,
        allEmpleados,
        getEmpleados,
        empleadosColumns,
        saveEmpleado, deleteEmpleados,

        fetchingMaquinas,
        allMaquinas, getMaquinas, maquinasColumns,
        saveMaquina, deleteMaquinas,

        fetchingClientes,
        allClientes, getClientes, clientesColumns,
        saveCliente, deleteClientes,

        fetchingProveedores,
        allProveedores, getProveedores, proveedoresColumns,
        saveProveedor, deleteProveedores,

        fetchingMateriales,
        allMateriales, getMateriales, materialesColumns,
        saveMaterial, deleteMateriales,

        getEmpleadoMaquinas, 

        fetchingModelos,
        allModelos, getModelos,
        saveModelo, deleteModelos,
        getModeloMaterial,

        notify
      }}>

      {children}
    </AppContext.Provider>
  )
}