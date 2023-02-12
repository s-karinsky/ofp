import dynamic from 'next/dynamic'
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import { showPopup, hidePopup } from '@store/popup'
import { setOrderCount, setOrderItems } from '@store/cart'

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
                setOrderCount={count => dispatch(setOrderCount(count))}
                setOrderItems={items => dispatch(setOrderItems(items))}
                isLogged={session.status === 'authenticated'}
            />
        </div>
    )
}
