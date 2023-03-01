import { Document, Page, PDFViewer, Text, View, StyleSheet } from "@react-pdf/renderer";

const FichaTecnicaPrint = ({ data }) => {

  const Casilla = ({ col, info }) => {
    return (
      <View style={[styles[col], styles.totalCenter, styles.pv5]}>
        <Text style={[styles.tCenter,]}>
          {info}
        </Text>
      </View>
    )
  }

  return (
    <>
      <PDFViewer className="w-full z-10 ">
        <Document >
          <Page size='A4' orientation="landscape" style={styles.body}>
            <View style={styles.p5}>
              <Text style={[styles.w100, styles.tCenter]} >
                TEJIDOS HELECHO
              </Text>
              <View style={[styles.row, styles.underline]}>
                <View style={[styles.colW4, styles.pv5, { backgroundColor: '#cbd5e1' }]} >
                  <Text style={styles.tCenter}>
                    NOMBRE DEL PROGRAMA:
                  </Text>
                </View>
              </View>
              <View style={[styles.row, styles.underline, { backgroundColor: '#e2e8f0' }]}>
                <Casilla col='colW2' info="No.MAQUINA"></Casilla>
                <Casilla col='colW2' info="TIPO DE MAQUINA"></Casilla>
                <Casilla col='colW' info="GALGA"></Casilla>
                <Casilla col='colW' info="CLIENTE"></Casilla>
                <Casilla col='colW' info="TALLA"></Casilla>
                <Casilla col='colW' info="VELOCIDAD"></Casilla>
                <Casilla col='colW' info="TIEMPO DE BAJADA"></Casilla>
                <Casilla col='colW' info="POSO POLIESTER"></Casilla>
                <Casilla col='colW' info="PESO MELT"></Casilla>
                <Casilla col='colW' info="PESO LUREX"></Casilla>
              </View>
              <View style={[styles.row, styles.underline]}>
                <Casilla col='colW2' info={data.numeroMaquina}></Casilla>
                <Casilla col='colW2' info={data.tipoMaquina} ></Casilla>
                <Casilla col='colW' info={data.galga}></Casilla>
                <Casilla col='colW' info={data.cliente}></Casilla>
                <Casilla col='colW' info={data.talla}></Casilla>
                <Casilla col='colW' info={data.velocidad}></Casilla>
                <Casilla col='colW' info={data.tiempoBajada}></Casilla>
                <Casilla col='colW' info={data.pesoPoliester}></Casilla>
                <Casilla col='colW' info={data.pesoMelt}></Casilla>
                <Casilla col='colW' info={data.pesoLurex}></Casilla>
              </View>
              <View style={[styles.row, styles.w100]}>
                <View style={[styles.colW2, styles.col]}>
                  <View style={[styles.w100, styles.row, styles.underline, { backgroundColor: '#e2e8f0' }]}>
                    <Casilla col='w100' info='NO.' />
                    <Casilla col='w100' info='PUNTOS' />
                  </View>
                  {data.puntos.map((p, i) => <View key={'ptos' + i} style={[styles.w100, styles.row, styles.underline]}>
                    <Casilla col='w100' info={p.no} />
                    <Casilla col='w100' info={p.puntos} />
                  </View>)
                  }

                </View>
                <View style={[styles.w80,]}>
                  <View style={[styles.w100, styles.row, styles.underline, { backgroundColor: '#e2e8f0' }]}>
                    <Casilla col='w20' info='GUIA HILOS' />
                    <Casilla col='w10' info='FIBRAS' />
                    <Casilla col='w10' info='CALIBRE' />
                    <Casilla col='w20' info='PROVEEDOR' />
                    <Casilla col='w20' info='COLORES' />
                    <Casilla col='w10' info='HEBRAS' />
                    <Casilla col='w10' info='MELT' />
                  </View>
                  {data.fibras.map((f, i) => <View key={'fibras' + i} style={[styles.w100, styles.row, styles.underline]}>
                    <Casilla col='w20' info={f.guiaHilos} />
                    <Casilla col='w10' info={f.fibras} />
                    <Casilla col='w10' info={f.calibre} />
                    <Casilla col='w20' info={f.proveedor} />
                    <Casilla col='w20' info={f.color} />
                    <Casilla col='w10' info={f.hebras} />
                    <Casilla col='w10' info={f.melt} />
                  </View>)}

                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
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
    paddingVertical: '10px'
  },
  border: {
    border: '3px solid #333333'
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
    borderBottom: '1px solif black'
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  p5: {
    padding: '20px',
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
  bgSlate: {
    backgroundColor: '#e2e8f0',
  },
})

export default FichaTecnicaPrint