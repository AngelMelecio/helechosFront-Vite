import { Canvas, Document, Image, PDFViewer, Page, View } from "@react-pdf/renderer";
import { useState } from "react";
//import QRCode from "react-qr-code";
import ReactDOM from 'react-dom';

//import QRCode from "react-qr-code";
import QRCode from 'qrcode';

let modelos = [
  "gixxer",
  "gsx",
  "gsx-r",
  "gsx-s",
  "gsx-f",
  "gsx-ss",
  "gsx-rr",

]

let colores = [
  "rojo",
  "azul",
  "verde",
  "amarillo",

]

let tallas = [
  "chica",
  "mediana",
  "grande",
  "extra grande",
  "extra extra grande",

]

let proveedores = [
  "proveedor 1",
  "proveedor 2",
  "proveedor 3",
  "proveedor 4",
  "proveedor 5",
  "proveedor 6",

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
                <View style={{
                  display: 'flex',
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'start',
                }}>
                  {<View style={{ height: '50%', width: '50%' }}>
                    <Image
                      src={GenerateQrUrl(d)}
                    />
                  </View>}
                </View>
              </Page>
            )
          }
        </Document>
      </PDFViewer>
    </div>
  )
}
export default PdfTest;