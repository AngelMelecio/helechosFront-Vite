import { Document, Page, PDFViewer, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { ICONS } from "../constants/icons";

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

const MAXROW = 34
const STARTJALON = 21
const STARTECON = 28

const FichaTecnicaPrint = ({ data, onCloseModal }) => {

  const [formatData, setFormatData] = useState([])

  useEffect(() => {

    /* 
        Se Combinan (puntos, jalones, economisadores) U (materiales) en una sola lista
    */


    let newData = []
    data.map(ficha => {
      if (ficha.isSelected) {
        let puntosMateriales = []
        for (let i = 0; i < MAXROW; i++) {
          let puntoMaterial = { ...puntoObj, ...materialObj }
          if (i < ficha.materiales.length)
            puntoMaterial = { ...puntoMaterial, ...ficha.materiales[i] }
          if (i < ficha.numeroPuntos.length)
            puntoMaterial = { ...puntoMaterial, ...ficha.numeroPuntos[i] }

          if (i >= STARTJALON && i < ficha.jalones.length + STARTJALON) {
            puntoMaterial = { ...puntoMaterial, ...ficha.jalones[i - STARTJALON] }
          }
          if (i >= STARTECON && i < ficha.economisadores.length + STARTECON) {
            puntoMaterial = { ...puntoMaterial, ...ficha.economisadores[i - STARTECON] }
          }
          puntosMateriales.push(puntoMaterial)
        }
        puntosMateriales[STARTJALON - 1].posicion = "JALON"
        puntosMateriales[STARTECON - 1].posicion = "Econom."

        newData.push({
          ...ficha,
          cliente: ficha.cliente.nombre,
          puntosMateriales: puntosMateriales,
        })
      }
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
      alignItems: 'center',
      ...props.style
    }
    return <View style={estilos}>{props.children}</View>
  }

  const Col = (props) => {
    let estilos = {
      display: 'flex',
      flexDirection: 'column',
      ...props.style
    }
    return <View style={estilos}>{props.children}</View>
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
              <PDFViewer className="w-full z-10 h-full">
                <Document>
                  {
                    formatData?.map((fich, i) => fich.isSelected &&
                      <Page key={'Page' + i} size='A4' style={styles.body}>
                        <View style={[styles.p5, {}]}>

                          <View style={{}}>
                            <Text style={[styles.w100, styles.tCenter, { fontWeight: 'bold', fontSize: '15', letterSpacing: '12px' }]} >
                              TEJIDOS HELECHO
                            </Text>
                          </View>

                          <View style={[styles.row, styles.w100, { lineHeight: '1.3px' }]}>
                            <View style={[styles.row, styles.w100, { paddingVertical: '5px', paddingHorizontal: '10px' }]}>
                              <Col>
                                <Row>
                                  <B>Modelo:  </B>
                                  <P>{fich.nombre}</P>
                                </Row>
                                <Row>
                                  <B>Nombre del Programa:  </B>
                                  <P>{fich.nombrePrograma}</P>
                                </Row>
                                <Row>
                                  <B>Cliente:  </B>
                                  <P>{fich.cliente}</P>
                                </Row>
                                <Text>{"\n"}</Text>
                                <Row>
                                  <B>Máquina Tejido</B>
                                </Row>
                                <Row>
                                  <B>Línea: </B>
                                  <P>{fich.maquinaTejido.linea}  </P>
                                  <B>Número: </B>
                                  <P>{fich.maquinaTejido.numero}  </P>
                                  <B>Marca: </B>
                                  <P>{fich.maquinaTejido.marca}</P>

                                </Row>
                                <Row style={{ justifyContent: 'space-around' }}>
                                  <Row>
                                    <B>Tipo:  </B>
                                    <P>{fich.tipoMaquinaTejido}</P>
                                  </Row>
                                  <Row>
                                    <B>GALGA:  </B>
                                    <P>{fich.galga}</P>
                                  </Row>
                                  <Row>
                                    <B>Velocidad:  </B>
                                    <P>{fich.velocidadTejido}</P>
                                  </Row>
                                </Row>
                              </Col>
                            </View>
                            <View style={[styles.row, styles.w100, { paddingVertical: '5px', paddingHorizontal: '10px' }]}>
                              <Col>
                                <Row>
                                  <Row>
                                    <B>Talla: </B>
                                    <P>{fich.talla}</P>
                                  </Row>
                                  <Row style={{ justifyContent: 'flex-end' }}>
                                    <B>ID:  </B>
                                    <P>{fich.idModelo}</P>
                                  </Row>
                                </Row>
                                <Row>
                                  <B>Peso</B>
                                </Row>
                                <Row >
                                  <Row style={{ justifyContent: 'flex-start' }}>
                                    <B>Poliester:  </B>
                                    <P>{fich.pesoPoliester}</P>
                                  </Row>
                                  <Row style={{ justifyContent: 'center' }}>
                                    <B>Melt:  </B>
                                    <P>{fich.pesoMelt}</P>
                                  </Row>
                                  <Row style={{ justifyContent: 'flex-end' }}>
                                    <B>Lurex:  </B>
                                    <P>{fich.pesoLurex}</P>
                                  </Row>
                                </Row>
                                <Text>{"\n"}</Text>
                                <Row>
                                  <B>Máquina Plancha</B>
                                </Row>
                                <Row>
                                  <B>Línea: </B>
                                  <P>{fich.maquinaPlancha.linea}  </P>
                                  <B>Número:  </B>
                                  <P>{fich.maquinaPlancha.numero}  </P>
                                  <B>Marca: </B>
                                  <P>{fich.maquinaPlancha.marca}</P>
                                </Row>
                                <Row >
                                  <Row>
                                    <B>Temperatura:  </B>
                                    <P>{fich.temperaturaPlancha}</P>
                                  </Row>
                                  <Row style={{ justifyContent: 'flex-end' }}>
                                    <B>Velocidad:  </B>
                                    <P>{fich.velocidadPlancha}</P>
                                  </Row>
                                </Row>
                              </Col>
                            </View>
                          </View>

                          <View style={{ borderLeft: '1px solid gray', borderTop: '1px solid black' }}>
                            <View style={[styles.row, { backgroundColor: '#e2e8f0' }]}>
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
                                  style={(i == STARTJALON - 1 || i == STARTECON - 1) && { backgroundColor: '#e2e8f0' }}
                                  col='colW'
                                  info={f.posicion} />

                                <Casilla
                                  style={(i == STARTJALON - 1 || i == STARTECON - 1) && { backgroundColor: '#e2e8f0' }}
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
  pv5: {
    paddingVertical: '5px'
  },
  border: {
    border: '1px solid gray',
    backgroundColor: '#dc2626',
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
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
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
  w80: {
    width: '83.33%',
  },
  colW2: {
    width: '16.66%',
  },
  colW4: {
    width: '33.33%',
  },
  w10: {
    width: '10%',
  },
  w20: {
    width: '20%',
  },
  w25: {
    width: '25%',
  },
  bgSlate: {
    backgroundColor: '#e2e8f0',
  },
  fullScreen: {
    zIndex: '10',
    display: 'flex',
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#3838388e',
    transition: '0.2s',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default FichaTecnicaPrint