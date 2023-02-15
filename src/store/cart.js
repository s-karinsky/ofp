import { createSlice } from '@reduxjs/toolkit'
import { getFormattedDate } from '@lib/datetime'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        orderCount: 0,
        orderId: '',
        date: '',
        status: '',
        items: [
            // {
            //     id: '1',
            //     price: 5000,
            //     name: 'Ортофотоплан 1',
            //     preview: '/images/bg_404.jpg',
            //     type: 'plan'
            // }
        ],
        checkedById: {}
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