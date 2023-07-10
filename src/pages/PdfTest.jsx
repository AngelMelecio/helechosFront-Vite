import { Document, Image, PDFViewer, Page, Text, View, Font } from "@react-pdf/renderer";
import { useState } from "react";
import QRCode from 'qrcode';
import RobotoBold from '../fonts/Roboto/Roboto-Bold.ttf'
import RobotoRegular from '../fonts/Roboto/Roboto-Regular.ttf'

Font.register({
  family: 'Roboto', fonts: [
    { src: RobotoBold, fontWeight: 700 },
    { src: RobotoRegular, fontWeight: 400 }
  ]
});


let modelos = [
  "gixxewewewewewr",
  "gixxewewewewewr",
  "gixxewewewewewr",
  "gixxewewewewewr",
  "gixxewewewewewr",
  "gixxewewewewewr",
]

let colores = [
  "\nrojo\nAzul\nAmarillo\nVerde\nNegro\nBlanco",
  "\nazul\nrojo\namarillo\nverde\nnegro\nblanco",
  "\nverde\nrojo\namarillo\nazul\nnegro\nblanco",
  "\namarillo\nrojo\nazul\nverde\nnegro\nblanco",

]

let tallas = [
  "26",
  "27",
  "25",
  "30",
  "29",

]

let proveedores = [
  "proveedor 1",
  "proveedor 2",
  "proveedor 3",
  "proveedor 4",
  "proveedor 5",
  "proveedor 6",

]

let num = [
  "1/5000",
  "2/5000",
  "3/5000",
  "4/5000",
  "5/5000"
]

let cantidad = [
  "1000",
  "1000",
  "1000",
  "1000",
  "5000"
]

const PdfTest = () => {
  const [data, setData] = useState(() => {
    let D = []
    for (let i = 0; i < 1; i++) {
      D.push({
        id: i,
        modelo: modelos[Math.floor(Math.random() * modelos.length)],
        color: colores[Math.floor(Math.random() * colores.length)],
        talla: tallas[Math.floor(Math.random() * tallas.length)],
        proveedor: proveedores[Math.floor(Math.random() * proveedores.length)],
        num: num[Math.floor(Math.random() * num.length)],
        cantidad: cantidad[Math.floor(Math.random() * cantidad.length)] + " prs",
      })
    }
    return D
  })

  const GenerateQrUrl = async (data) => {
    const jsonString = JSON.stringify(data);
    return QRCode.toDataURL(jsonString)

    // usando api
    //return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${jsonString}`
  }

  return (
    <div className="flex w-full h-full relative pl-18 bg-slate-100">

      <PDFViewer className="w-full h-full">
        <Document>
          {
            data.map((d, i) =>
              <Page
                size={[102, 102]}
                key={i}
              >
                <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Roboto', fontWeight: 700,fontSize: 8 }}>{d.modelo}</Text>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3' }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5 }}>Talla: </Text>
                      <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{d.talla}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5 }}># Etiqueta: </Text>
                      <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{d.num}</Text>
                    </View>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3' }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5 }}>Cantidad: </Text>
                      <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{d.cantidad}</Text>
                    </View>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '3' }}>
                    <View><Text style={{ fontSize: 5 }}>Tejedor:</Text></View>
                    <View><Text style={{ fontSize: 5 }}>__________________ / _____</Text></View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '1' }}>
                    <View><Text style={{ fontSize: 5 }}>Planchador:</Text></View>
                    <View><Text style={{ fontSize: 5 }}>__________________ / _____</Text></View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '1' }}>
                    <View><Text style={{ fontSize: 5 }}>Cortador:</Text></View>
                    <View><Text style={{ fontSize: 5 }}>__________________ / _____</Text></View>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '1' }}>
                    <View><Text style={{ fontSize: 5 }}>Empacador:</Text></View>
                    <View><Text style={{ fontSize: 5 }}>__________________ / _____</Text></View>
                  </View>


                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'start',
                      height: '100%',
                      width: '100%',
                      flexDirection: 'column',
                    }}>
                      {
                        <View style={{}}>
                          <Image
                            src={GenerateQrUrl(d)}
                          />
                        </View>
                      }
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'col', justifyContent: 'space-between', flex: 1, marginTop: 2 }}>
                      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5 ,position:"absolute", width:'100%'}}>Colores: </Text>
                        <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{d.color}</Text>
                      </View>
                    </View>

                  </View>
                </View>

              </Page>
            )
          }
        </Document>
      </PDFViewer>
    </div >
  )
}
export default PdfTest;