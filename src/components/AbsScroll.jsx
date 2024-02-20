import React, { useRef } from 'react'

const Loader = () =>{
    return(
        <></>
    )
}

const AbsScroll = ({
    vertical = false,
    horizontal = false,
    loading,
    children,
    onBottomReached,
    setBottom,
    className
}) => {

    const pageRef = useRef(null)

    const handleScroll = () => {
        let isBottom = (Math.ceil(
            pageRef.current.scrollTop + pageRef.current.clientHeight) >=
            pageRef.current.scrollHeight)

        setBottom && setBottom(isBottom)

        if (isBottom) {
            onBottomReached && onBottomReached()
        }
    }

    return (
        <div className={`w-full h-full ${className}`}>
            <div
                ref={pageRef}
                onScroll={(onBottomReached || setBottom) && handleScroll}
                className={`relative w-full h-full ${vertical ? 'overflow-y-scroll' : 'overflow-y-hidden'} ${horizontal ? 'overflow-x-scroll' : 'overflow-x-hidden'}`}>
                {loading ? <Loader /> :
                    <div className='absolute top-0 w-full emerge'>
                        {children}
                    </div>
                }
            </div>
        </div>
    )
}

export default AbsScroll