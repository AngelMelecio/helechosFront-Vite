import { useNavigate, useParams } from "react-router-dom";
import { ICONS } from "../../constants/icons";
import {useUsuarios} from './hooks/useUsuarios'

const DetailUsuario = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  const isEdit = (id !== '0')

  const {loading} = useUsuarios()

  return (
    <>
      <div className="w-full relative overflow-hidden">
        <div id="tbl-page" className="flex flex-col h-full w-full bg-slate-100 absolute px-8 py-5">
          <div className="flex pb-4 ">
            <button
              onClick={() => navigate(-1)}
              className="neutral-button h-10 w-10 rounded-full"> <ICONS.Left size="30px" /> </button>
            <p className="font-bold text-3xl pl-3 text-teal-700">
              {isEdit ? `Detalles del Usuario` : "Nuevo Usuario"}
            </p>
          </div>
          <div className="flex flex-col bg-white h-full rounded-t-lg relative shadow-lg">
            <div className='w-full flex h-full flex-col '>
              <input
                disabled={loading}
                className='bg-teal-500 p-1 w-40 text-white normal-button absolute right-10 z-10 top-5 rounded-lg'
                type="submit"
                value={isEdit ? "GUARDAR" : "AGREGAR"}
                form="frmUsuarios"
              />
              <div className="flex w-full h-full ">
                {
                  
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default DetailUsuario