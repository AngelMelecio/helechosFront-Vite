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
    console.log(list)
    const generateQrUrls = async () => {
      const urls = await Promise.all(list.map((obj) => GenerateQrUrl(obj)));
      setQrUrls(urls);
    };
    generateQrUrls();
  }, [list]);


  const GenerateQrUrl = async (data) => {
    const jsonString = JSON.stringify(data);
    console.log(jsonString)
    return await QRCode.toDataURL(jsonString)
  }

  return (
    //<div className="absolute flex w-3/4 h-4/5 pl-18 bg-slate-100">
    <>
      <div className='absolute z-10 flex items-center justify-center w-full h-full grayTrans '>
        <div className='w-3/4 h-full rounded-lg shadow-xl modal-box pdf-gray'  >
          <div className='flex flex-col w-full h-full p-1'>
            <div className="relative z-10 flex w-full h-12 px-4 py-2">
              <div className="relative flex flex-row w-full total-center ">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onCloseModal(false);
                  }}
                  className="absolute flex items-center justify-center p-1 text-white rounded-full left-1 hover:bg-gray-500">
                  <ICONS.Cancel size="20px" />
                </button>
                <p className="text-2xl font-semibold text-white">
                  Impresión de etiquetas
                </p>
              </div>
            </div>

            <div id="modal-body" className="flex w-full h-full ">
              <div className='absolute flex flex-col justify-center w-full h-full bg-transparent'>
                <div className='flex flex-row justify-center text-3xl text-white font-extralight'>
                  Generando etiquetas...
                </div>
                <div className='flex flex-row justify-center'>
                  <Loader color={"white"} />
                </div>
              </div>
              <PDFViewer className="z-10 w-full h-full">
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
                              <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 7.5 }}>{obj.modelo}</Text>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3' }}>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4.5 }}>Talla: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4.5 }}>{obj.talla}</Text>
                              </View>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4.5 }}># Etiqueta: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4.5 }}>{obj.numEtiqueta}</Text>
                              </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3' }}>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4.5 }}>Cantidad: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4.5 }}>{obj.cantidad}</Text>
                              </View>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4.5 }}>O.C.: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4.5 }}>{obj.od}</Text>
                              </View>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3' }}>
                              <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4.5 }}>Tipo: </Text>
                                <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4.5 }}>{obj.tipo}</Text>
                              </View>
                              {
                                obj.destino !== null &&
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                  <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4.5 }}>Destino: </Text>
                                  <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4.5 }}>{obj.destino}</Text>
                                </View>
                              }

                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '2' }}>
                              <View><Text style={{ fontSize: 4.5 }}>Tejedor:</Text></View>
                              <View><Text style={{ fontSize: 4 }}>____________________ / ________</Text></View>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '1' }}>
                              <View><Text style={{ fontSize: 4.5 }}>Planchador:</Text></View>
                              <View><Text style={{ fontSize: 4 }}>____________________ / ________</Text></View>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '1' }}>
                              <View><Text style={{ fontSize: 4.5 }}>Cortador:</Text></View>
                              <View><Text style={{ fontSize: 4 }}>____________________ / ________</Text></View>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3', marginTop: '1' }}>
                              <View><Text style={{ fontSize: 4.5 }}>Empacador:</Text></View>
                              <View><Text style={{ fontSize: 4 }}>____________________ / ________</Text></View>
                            </View>


                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                              <View style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'start',
                                height: '95%',
                                width: '95%',
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
                                  <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4.5, width: '100%' }}>Colores: </Text>
                                  <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4.5 }}>{obj.color}</Text>
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