import { Outlet } from 'react-router-dom'
import type { FC } from 'react'

const index: FC = () => {
    return (
        <div>
            <p>
                The page you are looking for doesn't exist or an other error occurred.
            </p>
            <Outlet />
        </div>
    )
}

export default index