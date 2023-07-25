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


let empleado = {
  "idEmpleado": 1,
  "fotografia": "/mediafiles/images/Screenshot_2023-03-06_095732.png",
  "nombre": "Maria Trinidad",
  "apellidos": "Madrigal Quintana",
  "direccion": "Rio Temascatio #43",
  "telefono": "5588545529",
  "ns": "12345678900",
  "fechaEntrada": "2023-06-15",
  "fechaAltaSeguro": "2023-06-29",
  "departamento": "Tejido",
  "gafete": null,
  "is_active": true
}

const PdfTest = () => {
  const [data, setData] = useState(() => [empleado])

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

                  <View style={{ justifyContent: 'center', alignItems: 'center', borderBottom: 0.8, marginVertical: 3, marginHorizontal: 3 }}>
                    <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5, letterSpacing: '3.2px', textAlign: 'center', width: '100%' }}>{"TEJIDOS HELECHO"}</Text>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginHorizontal: '3', height: '30%' }}>
                    <View style={{ border: 0.4, width: '27%', height: '100%', }}></View>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginHorizontal: '3', marginVertical: '2' }}>
                    <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4 }}>{d.nombre + " " + d.apellidos}</Text>
                  </View>


                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'start', flexDirection: 'column' }}>

                      <View style={{}}>
                        <Image
                          src={GenerateQrUrl(d)}
                        />
                      </View>

                    </View>

                    <View style={{ display: 'flex', flexDirection: 'col', justifyContent: 'space-between', flex: 1, marginTop: 2 }}>
                      <View style={{ display: 'flex', flexDirection: 'col', justifyContent: 'flex-start' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between', marginRight:3}}>
                          <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4 }}>Departamento: </Text>
                          <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4 }}>{d.departamento}</Text>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between', marginRight:3,marginVertical:2}}>
                          <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4 }}>NS: </Text>
                          <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4 }}>{d.ns}</Text>
                        </View>
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