import RobotoBold from '../fonts/Roboto/Roboto-Bold.ttf'
import RobotoRegular from '../fonts/Roboto/Roboto-Regular.ttf'
import { Document, Image, PDFViewer, Page, Text, View, Font } from "@react-pdf/renderer";
import QRCode from 'qrcode';
import { useState, useEffect } from 'react';
import { ICONS } from "../constants/icons";
import Loader from "./Loader/Loader";


const LabelToPrint = ({ list, onCloseModal }) => {
  Font.register({
    family: 'Roboto', fonts: [
      { src: RobotoBold, fontWeight: 700 },
      { src: RobotoRegular, fontWeight: 400 }
    ]
  });

  const [qrUrls, setQrUrls] = useState([]);

  useEffect(() => {
    const generateQrUrls = async () => {
      const urls = await Promise.all(list.map( data => (
        {
          idProduccion: data.idProduccion,
          idPedido: data.idPedido,
          modelo: data.modelo,
          color: data.color,
          talla: data.tallaReal,
          numEtiqueta: data.numEtiqueta,
          cantidad: data.cantidad,
        }
      ) ).map((obj) => GenerateQrUrl(obj)));
      setQrUrls(urls);
    };
    generateQrUrls();
  }, [list]);


  const GenerateQrUrl = async (data) => {
    const jsonString = JSON.stringify(data);
    return await QRCode.toDataURL(jsonString)
  }

  return (
    //<div className="flex w-3/4 h-4/5 absolute pl-18 bg-slate-100">
    <>
      <div className='z-10 flex absolute h-full w-full grayTrans items-center justify-center '>
        <div className='modal-box h-full w-3/4 rounded-lg pdf-gray shadow-xl'  >
          <div className='w-full flex h-full flex-col p-1'>
            <div className="z-10 py-2 px-4 flex w-full h-12 relative">
              <div className="flex flex-row w-full total-center relative ">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onCloseModal(false);
                  }}
                  className="absolute left-1 p-1 text-white flex items-center justify-center rounded-full hover:bg-gray-500">
                  <ICONS.Cancel size="20px" />
                </button>
                <p className="font-semibold text-white text-2xl">
                  Impresión de etiquetas
                </p>
              </div>
            </div>

            <div id="modal-body" className="flex w-full h-full ">
              <div className='flex w-full h-full absolute bg-transparent flex-col justify-center'>
                <div className='font-extralight text-white text-3xl flex flex-row justify-center'>
                  Generando etiquetas...
                </div>
                <div className='flex flex-row justify-center'>
                  <Loader color={"white"} />
                </div>
              </div>
              <PDFViewer className="w-full z-10 h-full">
                <Document>
                  {
                    list.map((obj, i) => {
                      delete obj.isSelected;
                      return (
                        <Page
                          size={[102, 102]}
                          key={i}
                        >

                          <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 8 }}>{obj.modelo}</Text>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3' }}>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5 }}>Talla: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{obj.talla}</Text>
                              </View>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5 }}># Etiqueta: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{obj.numEtiqueta}</Text>
                              </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3' }}>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5 }}>Cantidad: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{obj.cantidad}</Text>
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
                                  qrUrls.length > 0 &&
                                  <View style={{}}>
                                    <Image
                                      src={qrUrls[i]}
                                    //src={GenerateQrUrl(obj)}
                                    />
                                  </View>
                                }
                              </View>

                              <View style={{ display: 'flex', flexDirection: 'col', justifyContent: 'space-between', flex: 1, marginTop: 2 }}>
                                <View style={{ display: 'flex', flexDirection: 'col', justifyContent: 'flex-start' }}>
                                  <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5, width: '100%' }}>Colores: </Text>
                                  <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 5 }}>{obj.color}</Text>
                                </View>
                              </View>

                            </View>

                          </View>

                        </Page>
                      )
                    })
                  }
                </Document>
              </PDFViewer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LabelToPrint;