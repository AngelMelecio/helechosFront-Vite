import RobotoBold from '../fonts/Roboto/Roboto-Bold.ttf'
import RobotoRegular from '../fonts/Roboto/Roboto-Regular.ttf'
import { Document, Image, PDFViewer, Page, Text, View, Font } from "@react-pdf/renderer";
import QRCode from 'qrcode';
import { ICONS } from "../constants/icons";
import Loader from "./Loader/Loader";
import { API_URL } from "../constants/HOSTS";


const GafetToPrint = ({ list, onCloseModal }) => {
    
    Font.register({
        family: 'Roboto', fonts: [
            { src: RobotoBold, fontWeight: 700 },
            { src: RobotoRegular, fontWeight: 400 }
        ]
    });

    const GenerateQrUrl = async (data) => {
        delete data.fotografia;
        const jsonString = JSON.stringify(data);
        return await QRCode.toDataURL(jsonString)
    }

    return (
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
                                    Impresión de gafetes
                                </p>
                            </div>
                        </div>

                        <div id="modal-body" className="flex w-full h-full ">
                            <div className='absolute flex flex-col justify-center w-full h-full bg-transparent'>
                                <div className='flex flex-row justify-center text-3xl text-white font-extralight'>
                                    Generando gafetes...
                                </div>
                                <div className='flex flex-row justify-center'>
                                    <Loader color={"white"} />
                                </div>
                            </div>
                            <PDFViewer className="z-10 w-full h-full">
                                <Document>
                                    {
                                        list.map((originalObj, i) => {
                                            // Clonamos el objeto
                                            let obj = { ...originalObj };                                            
                                            delete obj.direccion;
                                            delete obj.telefono;
                                            delete obj.fechaEntrada;
                                            delete obj.fechaAltaSeguro;
                                            delete obj.gafete;
                                            delete obj.estado;
                                            delete obj.is_active;
                                            delete obj.isSelected;

                                            return (
                                                <Page
                                                    size={[102, 102]}
                                                    key={i}
                                                >

                                                    <View style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

                                                        <View style={{ justifyContent: 'center', alignItems: 'center', borderBottom: 0.8, marginVertical: 3, marginHorizontal: 3 }}>
                                                            <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 5, letterSpacing: '3.2px', textAlign: 'center', width: '100%' }}>{"TEJIDOS HELECHO"}</Text>
                                                        </View>

                                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginHorizontal: '3', height: '30%' }}>
                                                                {obj.fotografia !== null && obj.fotografia !== "" ?
                                                                <Image style={{ border: 0.4, width: '27%', height: '100%', position:'absolute' }} src={obj.fotografia} />:
                                                                <View style={{ border: 0.4, width: '27%', height: '100%', }} />}
                                                                
                                                        </View>

                                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginHorizontal: '3', marginVertical: '2' }}>
                                                            <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4 }}>{obj.nombre + " " + obj.apellidos}</Text>
                                                        </View>


                                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <View style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'start', flexDirection: 'column' }}>

                                                                <View style={{}}>
                                                                    <Image
                                                                        src={GenerateQrUrl(obj)}
                                                                    />
                                                                </View>

                                                            </View>

                                                            <View style={{ display: 'flex', flexDirection: 'col', justifyContent: 'space-between', flex: 1, marginTop: 2 }}>
                                                                <View style={{ display: 'flex', flexDirection: 'col', justifyContent: 'flex-start' }}>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: 3 }}>
                                                                        <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4 }}>Departamento: </Text>
                                                                        <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4 }}>{obj.departamento}</Text>
                                                                    </View>

                                                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: 3, marginVertical: 2 }}>
                                                                        <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4 }}>NSS: </Text>
                                                                        <Text style={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: 4 }}>{obj.ns}</Text>
                                                                    </View>
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

export default GafetToPrint;