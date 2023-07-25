import RobotoBold from '../fonts/Roboto/Roboto-Bold.ttf'
import RobotoRegular from '../fonts/Roboto/Roboto-Regular.ttf'
import { Document, Image, PDFViewer, Page, Text, View, Font } from "@react-pdf/renderer";
import QRCode from 'qrcode';
import { useState, useEffect } from 'react';
import { ICONS } from "../constants/icons";
import Loader from "./Loader/Loader";

const useImageData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            setLoading(true);
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const dataUrl = URL.createObjectURL(blob);
                setData(dataUrl);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        loadImage();
    }, [url]);

    return { data, loading, error };
};

const GafetToPrint = ({ list, onCloseModal }) => {
    Font.register({
        family: 'Roboto', fonts: [
            { src: RobotoBold, fontWeight: 700 },
            { src: RobotoRegular, fontWeight: 400 }
        ]
    });

    const GenerateQrUrl = async (data) => {
        const jsonString = JSON.stringify(data);
        return await QRCode.toDataURL(jsonString)
    }

    return (
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
                                    Impresión de gafetes
                                </p>
                            </div>
                        </div>

                        <div id="modal-body" className="flex w-full h-full ">
                            <div className='flex w-full h-full absolute bg-transparent flex-col justify-center'>
                                <div className='font-extralight text-white text-3xl flex flex-row justify-center'>
                                    Generando gafetes...
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
                                            delete obj.is_active;
                                            const { data: imageUrl, loading, error } = useImageData(obj.fotografia); // Using hook
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
                                                            {(imageUrl && error===null)? 
                                                                <Image style={{ border:0.4,width: '27%', height: '100%', }} src={imageUrl}/>:
                                                                <View style={{ border: 0.4, width: '27%', height: '100%', }}/>}
                                                          
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
                                                                        <Text style={{ fontFamily: 'Roboto', fontWeight: 700, fontSize: 4 }}>NS: </Text>
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