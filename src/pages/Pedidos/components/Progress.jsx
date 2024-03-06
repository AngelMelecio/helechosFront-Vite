import chroma from 'chroma-js'
import React from 'react'

let RED = '#ef4444'
let ORANGE = '#f97316'
let YELLOW = '#fbbf24'
let GREEN = '#22c55e'

const Progress = ({ data }) => {
    return (
        <div className='relative flex flex-col items-start justify-center w-full h-10 '>
            <p className='w-full text-sm font-bold gray-700'>
                %{data}
            </p>
            <div
                className='relative w-full h-2 rounded-full bg-slate-200/80'>
                <div
                    style={{
                        width: `${data}%`,
                        backgroundColor:
                            data <= 25 ? RED :
                                data <= 50 ? ORANGE :
                                    data <= 75 ? YELLOW : GREEN
                    }}
                    className="absolute h-full rounded-full">
                </div>
            </div>
        </div>
    )
}

export default Progress