import { createSlice } from '@reduxjs/toolkit'
import { getFormattedDate } from '@lib/datetime'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        orderCount: 0,
        orderId: '3319775',
        date: '23.01.2023',
        status: 'order',
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
                price: null,
                name: 'Съемка ортофотоплана',
                preview: '/images/bg_404.jpg',
                type: 'shoot'
            }
        ],
        checkedById: {
            ['1']: true,
            ['2']: true,
            ['3']: true
        }
    },
    reducers: {
        setOrderCount(state, action) {
            state.orderCount = action.payload
        },
        setChecked(state, action) {
            if (typeof action.payload === 'boolean') {
                Object.keys(state.checkedById).map(key => {
                    state.checkedById[key] = action.payload
                })
            } else {
                state.checkedById = action.payload   
            }
        },
        setOrderData(state, payload) {
            const { orderId, date, status } = payload
            if (orderId) state.orderId = orderId
            if (date) state.date = getFormattedDate(date)
            if (status) state.status = status
        },
        setOrderItems(state, action) {
            state.items = action.payload
            state.checkedById = state.items.reduce((res, item) => ({
                ...res,
                [item.id]: true
            }), {})
        },
        removeById(state, action) {
            const id = action.payload
            state.items = state.items.filter(item => item.id !== id)
            state.checkedById = state.items.reduce((res, item) => ({
                ...res,
                [item.id]: state.checkedById[item.id]
            }), {})
        }
    }
})

const { actions, reducer } = cartSlice
export const { setChecked, removeById, setOrderCount, setOrderData, setOrderItems } = actions
export default reducer