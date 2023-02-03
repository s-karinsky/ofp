import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Profile from '@components/Profile'
import axios from '@lib/axios'
import { setIsLoaded, setUserData, setIsLoading } from '@store/profile'

export default function PageProfile() {
    const isLoaded = useSelector(state => state.profile.isLoaded)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!isLoaded) {
            dispatch(setIsLoading(true))
            axios.get('user').then(res => {
                if (res.data && res.data.user) {
                    const { _id, ...data } = res.data.user
                    dispatch(setUserData(data))
                    dispatch(setIsLoading(false))
                    dispatch(setIsLoaded(true))
                }
            })
        }
    }, [isLoaded])

    return isLoaded ?
        <Profile /> :
        null
}
