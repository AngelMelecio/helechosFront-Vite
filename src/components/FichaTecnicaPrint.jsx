import { Document, Page, PDFViewer, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { ICONS } from "../constants/icons";

const puntoObj = {
  posicion: '',
  valor: ''
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

const FichaTecnicaPrint = ({ data, onCloseModal }) => {

  const [formatData, setFormatData] = useState([])
  const [puntosHebras, setPuntosHebras] = useState([])

  useEffect(() => {
    let newData = []
    data.map(ficha => {
      if (ficha.isSelected) {
        let puntosMateriales = []
        for (let i = 0; i < Math.max(ficha.materiales.length, ficha.numeroPuntos.length); i++) {
          let puntoMaterial = { ...puntoObj, ...materialObj }
          if (ficha.materiales.length > i)
            puntoMaterial = { ...puntoMaterial, ...ficha.materiales[i] }
          if (ficha.numeroPuntos.length > i)
            puntoMaterial = { ...puntoMaterial, ...ficha.numeroPuntos[i] }
          puntosMateriales.push(puntoMaterial)
        }
        newData.push({ ...ficha, puntosMateriales: puntosMateriales })
      }
    })
    setFormatData(newData)
  }, [])

  const Casilla = ({ col, info }) => {
    return (
      <View style={[styles[col], styles.totalCenter, styles.pv5, {border:'1px solid black'} ]} >
        <Text style={[styles.tCenter,]}>
          {info}
        </Text>
      </View>
    )
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
                      <Page key={'Page' + i} size='A4' orientation="landscape" style={styles.body}>
                        <View style={[styles.p5, { height: '100%' }]}>
                          
                          <View style={[styles.pv5]}>
                            <Text style={[styles.w100, styles.tCenter]} >
                              TEJIDOS HELECHO
                            </Text>
                          </View>

                          <View style={{ border: '2px solid black' }}>
                            <View style={[styles.row, styles.underline, { backgroundColor: '#e2e8f0' }]}>
                              <Casilla col='w25' info="NOMBRE"></Casilla>
                              <Casilla col='w25' info="NOMBRE DEL PROGRAMA"></Casilla>
                              <Casilla col='colW2' info="CLIENTE"></Casilla>
                              <Casilla col='colW' info="TALLA"></Casilla>
                              <Casilla col='colW' info="PESO POLIESTER"></Casilla>
                              <Casilla col='colW' info="PESO MELT"></Casilla>
                              <Casilla col='colW' info="PESO LUREX"></Casilla>
                            </View>
                            <View style={[styles.row, styles.underline]}>
                              <Casilla col='w25' info={fich.nombre}></Casilla>
                              <Casilla col='w25' info={fich.nombrePrograma} ></Casilla>
                              <Casilla col='colW2' info={fich.cliente}></Casilla>
                              <Casilla col='colW' info={fich.talla}></Casilla>
                              <Casilla col='colW' info={fich.pesoPoliester}></Casilla>
                              <Casilla col='colW' info={fich.pesoMelt}></Casilla>
                              <Casilla col='colW' info={fich.pesoLurex}></Casilla>
                            </View>

                            <View style={[styles.row, styles.underline, { backgroundColor: '#e2e8f0' }]}>
                              <Casilla col='w25' info="MAQUINA TEJIDO"></Casilla>
                              <Casilla col='colW2' info="TIPO MAQUINA TEJIDO"></Casilla>
                              <Casilla col='colW' info="GALGA"></Casilla>
                              <Casilla col='colW' info="VELOCIDAD"></Casilla>
                              <Casilla col='colW' info="TIEMPO BAJADA"></Casilla>
                              <Casilla col='colW2' info="MAQUINA PLANCHA"></Casilla>
                              <Casilla col='colW' info="VELOCIDAD PLANCHA"></Casilla>
                              <Casilla col='colW' info="TEMPERATURA"></Casilla>
                            </View>
                            <View style={[styles.row, styles.underline]}>
                              <Casilla col='w25' info={fich.maquinaTejido}></Casilla>
                              <Casilla col='colW2' info={fich.tipoMaquinaTejido}></Casilla>
                              <Casilla col='colW' info={fich.galga}></Casilla>
                              <Casilla col='colW' info={fich.velocidadTejido}></Casilla>
                              <Casilla col='colW' info={fich.tiempoBajada}></Casilla>
                              <Casilla col='colW2' info={fich.maquinaPlancha}></Casilla>
                              <Casilla col='colW' info={fich.velocidadPlancha}></Casilla>
                              <Casilla col='colW' info={fich.temperaturaPlancha}></Casilla>
                            </View>
                            <View style={[styles.row, styles.underline, { backgroundColor: '#e2e8f0' }]}>
                              <Casilla col='colW' info='NO.' />
                              <Casilla col='colW' info='PUNTOS' />
                              <Casilla col='colW' info='GUIA HILOS' />
                              <Casilla col='colW2' info='HEBRAS' />
                              <Casilla col='colW' info='CALIBRE' />
                              <Casilla col='colW2' info='PROVEEDOR' />
                              <Casilla col='colW2' info='COLORES' />
                              <Casilla col='colW' info='TIPO' />
                              <Casilla col='colW' info='PESO' />
                            </View>

                            {fich?.puntosMateriales?.map((f, i) =>
                              <View key={'puntosM' + i} style={[styles.w100, styles.row, styles.underline]}>
                                <Casilla col='colW' info={f.posicion} />
                                <Casilla col='colW' info={f.valor} />
                                <Casilla col='colW' info={f.guiaHilos} />
                                <Casilla col='colW2' info={f.hebras} />
                                <Casilla col='colW' info={f.calibre} />
                                <Casilla col='colW2' info={f.proveedor} />
                                <Casilla col='colW2' info={f.color} />
                                <Casilla col='colW' info={f.tipo} />
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
    border: '3px solid black',
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
  underline: {
    //borderBottom: '1px solid black'
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  p5: {
    padding: '25px',
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
    //    z-10 flex absolute h-full w-full grayTrans items-center justify-center
  }
})

export default FichaTecnicaPrint