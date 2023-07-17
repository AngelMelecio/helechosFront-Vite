import './loaderStyles.css'

const Loader = ({color}) => {
    return (
        <div className='flex w-full justify-center items-center'>
            <div className={'lds-ellipsis '+color}><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
export default Loader 