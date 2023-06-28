
import DynamicInput from "../../components/DynamicInput"
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCapturaProduccion } from "./hooks/useCapturaProduccion";
import { ICONS } from "../../constants/icons";
import { useFormik, FormikProvider } from "formik";
import Input from "../../components/Input";
import Loader from "../../components/Loader/Loader";

const initCaptura = {
   
}


const PaginaCaptura = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    
    return (
        <>
          
        </>
    )
}
export default PaginaCaptura