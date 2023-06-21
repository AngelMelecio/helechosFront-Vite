import './loaderStyles.css'

const Loader = () => {
    return (
        <div className='flex w-full justify-center items-center'>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
export default Loader 