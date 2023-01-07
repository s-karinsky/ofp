import { createSlice } from '@reduxjs/toolkit'

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        user: {
            name: 'Иванов Иван Иванович',
            email: 'ivanov@ivan.iv',
            phone: '+79235554411'
        },
        orders: [
            {
                orderId: '3319771',
                date: '23.10.2022',
                status: 'success',
                items: [
                    {
                        id: '3',
                        price: 10000,
                        name: 'Съемка ортофотоплана',
                        preview: '/images/bg_404.jpg',
                        type: 'shoot'
                    }
                ]
            },
            {
                orderId: '3319772',
                date: '23.11.2022',
                status: 'success',
                items: [
                    {
                        id: '1',
                        price: 5000,
                        name: 'Ортофотоплан 1',
                        preview: '/images/bg_404.jpg',
                        type: 'plan'
                    }
                ]
            },
            {
                orderId: '3319774',
                date: '23.12.2022',
                status: 'success',
                items: [
                    {
                        id: '1',
                        price: 5000,
                        name: 'Ортофотоплан 1',
                        preview: '/images/bg_404.jpg',
                        type: 'plan'
                    }, {
                        id: '2',
                        price: 7000,
                        name: 'Ортофотоплан 2',
                        preview: '/images/bg_404.jpg',
                        type: 'plan'
                    }, {
                        id: '3',
                        price: 15000,
                        name: 'Съемка ортофотоплана',
                        preview: '/images/bg_404.jpg',
                        type: 'shoot'
                    }
                ]
            }
        ]
    },
    reducers: {
        setUserData(state, action) {
            state.user = {
                ...state.user,
                ...action.payload
            }
        }
    }
})

const { actions, reducer } = profileSlice
export const { setUserData } = actions
export default reducer