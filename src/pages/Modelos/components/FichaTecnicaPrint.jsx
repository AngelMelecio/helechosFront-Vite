import { Document, Page, PDFViewer, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { ICONS } from "../../../constants/icons";

const puntoObj = {
  posicion: '',
  valor: '',
}

const materialObj = {
  peso: '',
  tipo: '',
  color: '',
  hebras: '',
  calibre: '',
  guiaHilo: '',
  proveedor: '',
  idMaterial: ''
}

const MAX_ROW = 34
const START_JALON = 21
const START_ECON = 28

const FichaTecnicaPrint = ({ data, onCloseModal }) => {

  const [formatData, setFormatData] = useState([])

  const [pesos, setPesos] = useState(() => {
    let pesoAcum = {}
    data[0].materiales.forEach(material => {
      if (pesoAcum.hasOwnProperty(material.tipo)) {
        pesoAcum[material.tipo].peso += Number(material.peso)
      } else {
        pesoAcum[material.tipo] = {
          peso: Number(material.peso)
        }
      }
    })
    return pesoAcum
  })


  useEffect(() => {
    /* 
        Se Combinan (puntos, jalones, economisadores) U (materiales) en una sola lista
    */
    let newData = []
    data.map(ficha => {

      let puntosMateriales = []
      for (let i = 0; i < MAX_ROW; i++) {
        let puntoMaterial = { ...puntoObj, ...materialObj }
        if (i < ficha.materiales.length)
          puntoMaterial = { ...puntoMaterial, ...ficha.materiales[i] }
        if (i < ficha.numeroPuntos.length)
          puntoMaterial = { ...puntoMaterial, ...ficha.numeroPuntos[i] }

        if (i >= START_JALON && i < ficha.jalones.length + START_JALON) {
          puntoMaterial = { ...puntoMaterial, ...ficha.jalones[i - START_JALON] }
        }
        if (i >= START_ECON && i < ficha.economisadores.length + START_ECON) {
          puntoMaterial = { ...puntoMaterial, ...ficha.economisadores[i - START_ECON] }
        }
        puntosMateriales.push(puntoMaterial)
      }
      puntosMateriales[START_JALON - 1].posicion = "JALON"
      puntosMateriales[START_ECON - 1].posicion = "Econom."

      newData.push({
        ...ficha,
        cliente: ficha.cliente.nombre,
        puntosMateriales: puntosMateriales,
      })

    })
    setFormatData(newData)
  }, [])


  /*
      Componentes con estilos preestablecidos
  */
  const Casilla = (props) => {
    let estyles = [
      styles[props.col],
      {
        padding: '2px',
        borderBottom: '1px solid gray',
        borderRight: '1px solid gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.style
      }
    ]
    return (
      <View
        style={estyles} >
        <View style={{ width: '100%', }}>
          <Text style={[styles.tCenter,]}>
            {props.info}
          </Text>
        </View>
      </View>
    )
  }

  const B = ({ children }) => <Text style={[{ fontWeight: '200', fontSize: '9' }]}>{children}</Text>
  const P = ({ children }) => <Text style={[{ fontWeight: 'normal', fontSize: '12' }]}>{children}</Text>

  const Row = (props) => {
    let estilos = {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      //      alignItems: 'center',
      ...props.style
    }
    return <View style={estilos}>{props.children}</View>
  }

  const Col = (props) => {
    let estilos = {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      ...props.style,
    }
    return <View style={estilos}>{props.children}</View>
  }

  const Right = (props) => {
    let estilos = {
      //width: '100%',
      textAlign: 'left',
      display: 'flex',
      //flexDirection: 'column',
      padding: '0 0 0 3px',
      color: '#0f766e',
      //backgroundColor: '#f3f4f6'
    }
    return <View style={estilos}>{props.children}</View>
  }

  const Left = (props) => {
    let estilos = {
      width: '100%',
      textAlign: 'right',
      display: 'flex',
      //flexDirection: 'column',
      padding: '0 3px 0 0',
      color: '#1f2937',
      //backgroundColor:'#FF2'
    }
    return <View style={estilos}>{props.children}</View>
  }

  const Center = (props) => {
    let estilos = {
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      borderBottom: '1px solid gray',
      color: '#111827',
      fontWeight: 'bold',
      paddingVertical: '2px',
    }
    return <Text style={estilos}>{props.children} </Text>
  }

  return (
    <>
      <div className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
        <div className='modal-box h-full w-3/4 rounded-lg pdf-gray shadow-xl'  >
          <div className='w-full flex h-full flex-col p-1'>
            <div className="z-10 py-2 px-4 flex w-full h-12 relative">
              <div className="flex flex-row w-full total-center relative ">
                <button
                  onClick={onCloseModal}
                  className="absolute left-1 p-1 text-white flex items-center justify-center rounded-full hover:bg-gray-500">
                  <ICONS.Cancel size="20px" />
                </button>
                <p className="font-semibold text-white text-2xl">
                  Imprimir Fichas
                </p>
              </div>
            </div>
            <div id="modal-body" className="flex w-full h-full ">
              <PDFViewer 
                className="w-full z-10 h-full">
                <Document>
                  {
                    formatData?.map((fich, i) =>
                      <Page key={'Page' + i} size='A4' style={styles.body}>
                        <View style={[styles.p5, {}]}>
                          <Row>
                            <Text style={[styles.w100, styles.tCenter, { fontWeight: 'bold', fontSize: '15', letterSpacing: '12px' }]} >
                              TEJIDOS HELECHO
                            </Text>
                          </Row>

                          <Row style={{ fontSize: '9', lineHeight: '1.3px', padding: '0 0 5px 0' }}>
                            {/**
                             * Datos de la ficha
                             */}
                            <Col style={{ padding: '5px', width:'40%' }}>
                              <Row style={{ padding: '3px' }}>
                                <Center>
                                  Datos de la ficha
                                </Center>
                              </Row>
                              <Row>
                                <Right><Text>
                                  ID modelo:
                                </Text></Right>
                                <Left><Text>
                                  {fich.modelo.idModelo}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Modelo:
                                </Text></Right>
                                <Left><Text>
                                  {fich.modelo.nombre}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Ficha:
                                </Text></Right>
                                <Left><Text>
                                  {fich.nombre}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Cliente:
                                </Text></Right>
                                <Left><Text>
                                  {fich.cliente}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Talla:
                                </Text></Right>
                                <Left><Text>
                                  {fich.talla}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Nom. Programa:
                                </Text></Right>
                                <Left><Text>
                                  {fich.nombrePrograma}
                                </Text></Left>
                              </Row>
                            </Col>
                            {/**
                             * Maquina Tejido
                             */}
                            <Col style={{ padding: '5px', width:'20%' }}>
                              <Row style={{ padding: '3px' }}>
                                <Center>
                                  Maquina Tejido
                                </Center>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Linea:
                                </Text></Right>
                                <Left><Text>
                                  {fich.maquinaTejido.linea}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Número:
                                </Text></Right>
                                <Left><Text>
                                  {fich.maquinaTejido.numero}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Marca:
                                </Text></Right>
                                <Left><Text>
                                  {fich.maquinaTejido.marca}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Tipo:
                                </Text></Right>
                                <Left><Text>
                                  {fich.tipoMaquinaTejido}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Galga:
                                </Text></Right>
                                <Left><Text>
                                  {fich.galga}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Velocidad:
                                </Text></Right>
                                <Left><Text>
                                  {fich.velocidadTejido}
                                </Text></Left>
                              </Row>
                            </Col>
                            {/**
                             * Maquina Plancha
                             */}
                            <Col style={{ padding: '5px', width:'20%' }}>
                              <Row style={{ padding: '3px' }}>
                                <Center>
                                  Maquina Plancha
                                </Center>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Linea:
                                </Text></Right>
                                <Left><Text>
                                  {fich.maquinaPlancha.linea}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Número:
                                </Text></Right>
                                <Left><Text>
                                  {fich.maquinaPlancha.numero}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Marca:
                                </Text></Right>
                                <Left><Text>
                                  {fich.maquinaPlancha.marca}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Temperatura:
                                </Text></Right>
                                <Left><Text>
                                  {fich.temperaturaPlancha}
                                </Text></Left>
                              </Row>
                              <Row>
                                <Right><Text>
                                  Velocidad:
                                </Text></Right>
                                <Left><Text>
                                  {fich.velocidadPlancha}
                                </Text></Left>
                              </Row>
                            </Col>
                            {/**
                             * Pesos Dinamicos
                             */}
                            <Col style={{ padding: '5px', width:'20%' }}>
                              <Row style={{ padding: '3px' }}>
                                <Center>
                                  Pesos
                                </Center>
                              </Row>
                              {
                                Object.keys(pesos).map((type, j) =>
                                  <Row key={"We" + j}>
                                    <Right><Text>
                                      {type}:
                                    </Text></Right>
                                    <Left><Text>
                                      {pesos[type].peso}
                                    </Text></Left>
                                  </Row>)
                              }
                            </Col>
                          </Row>

                          <View style={{ borderLeft: '1px solid gray', borderTop: '1px solid gray' }}>
                            <View style={[styles.row, { backgroundColor: '#f0fdfa', color: '#1f2937' }]}>
                              <Casilla col='colW' info='No.' />
                              <Casilla col='colW' info='Puntos' />
                              <Casilla col='colW' info='Guía Hilos' />
                              <Casilla col='colW2' info='Tipo' />
                              <Casilla col='colW' info='Calibre' />
                              <Casilla col='colW2' info='Proveedor' />
                              <Casilla col='colW2' info='Colores' />
                              <Casilla col='colW' info='Hebras' />
                              <Casilla col='colW' info='Peso' />
                            </View>

                            {fich?.puntosMateriales?.map((f, i) =>
                              <View key={'puntosM' + i} style={[styles.w100, styles.row, { height: '17px', fontSize: '9' }]}>

                                <Casilla
                                  style={(i == START_JALON - 1 || i == START_ECON - 1) && { backgroundColor: '#f0fdfa' }}
                                  col='colW'
                                  info={f.posicion} />

                                <Casilla
                                  style={(i == START_JALON - 1 || i == START_ECON - 1) && { backgroundColor: '#f0fdfa' }}
                                  col='colW' info={f.valor} />

                                <Casilla col='colW' info={f.guiaHilos} />
                                <Casilla col='colW2' info={f.tipo} />
                                <Casilla col='colW' info={f.calibre} />
                                <Casilla col='colW2' info={f.nombreProveedor} />
                                <Casilla col='colW2' info={f.color} />
                                <Casilla col='colW' info={f.hebras} />
                                <Casilla col='colW' info={f.peso} />
                              </View>)}
                          </View>
                        </View>
                      </Page>
                    )}
                </Document>
              </PDFViewer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = StyleSheet.create({
  body: {
    fontSize: '11',
  },
  w100: {
    width: '100%',
  },
  border: {
    border: '1px solid gray',
    backgroundColor: '#f0fdfa',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  },
  totalCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

  },
  p5: {
    paddingVertical: '10px',
    paddingHorizontal: '20px',
  },
  px2: {
    padding: '10px'
  },
  tCenter: {
    textAlign: 'center',
  },
  colW: {
    width: '8.33%',
  },
  colW2: {
    width: '16.66%',
  },
})

export default FichaTecnicaPrint