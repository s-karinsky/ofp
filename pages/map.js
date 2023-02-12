import dynamic from 'next/dynamic'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import { showPopup, hidePopup } from '@store/popup'

const MyMap = dynamic(() => import('@components/Map'), { ssr: false });
export default function MapPage() {
    const dispatch = useDispatch()
    const session = useSession()
    const show = name => dispatch(showPopup(name))
    const hide = () => dispatch(hidePopup()) 
    return (
        <div className="map">
            <MyMap
                showPopup={show}
                hidePopup={hide}
                isLogged={session.status === 'authenticated'}
            />
        </div>
    )
}
