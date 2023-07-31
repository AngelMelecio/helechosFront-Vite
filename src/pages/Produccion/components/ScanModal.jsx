import { ICONS } from "../../../constants/icons";

const ScanModal = ({ title, onScan, onClose }) => {
  return (
    <div className="flex grayTrans w-full h-full total-center">
      <div className="relative flex flex-col  h-1/2 total-center">
        <div className="flex relative w-full">
          <button
            type="button"
            onClick={onClose}
            className=" h-8 w-8 neutral-button rounded-full top-0 left-0 ">
            <ICONS.Cancel size="20px" />
          </button>
        </div>
        <div className="scan-icon relative opacity-75">
          <ICONS.Qr size="350px" color="#0f766e" />
        </div>
        <input
          className="visible opacity-0 h-0 w-0"
          type="text"
          autoFocus={true}
          onBlur={e => e.target.focus()}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              console.log(e.target.value);
              onScan(e.target.value);
              e.target.value = '';
            }
          }}
        />
        <p className="text-center w-full font-bold italic text-gray-700 text-2xl">
          {title}
        </p>
      </div>
    </div>
  )
}
export default ScanModal