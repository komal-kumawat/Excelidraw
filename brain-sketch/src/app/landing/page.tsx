import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div>
            landing

            <Link href="/draw">
                <button className='border m-5 p-2'>Draw</button>

            </Link>
        </div>
    )
}

export default page
