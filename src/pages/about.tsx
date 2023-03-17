import { Outlet } from 'react-router-dom'
import type { FC } from 'react'

const Component: FC = () => {
    return (
        <div>
            <p>nested about view:</p>
            <Outlet />
        </div>
    )
}

export default Component