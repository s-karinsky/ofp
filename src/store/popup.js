import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isVisible: false,
        popupName: null
    },
    reducers: {
        showPopup(state, action) {
            state.popupName = action.payload;
            state.isVisible = true;
        },
        hidePopup(state) {
            state.isVisible = false;
        }
    }
})

const { actions, reducer } = modalSlice
export const { showPopup, hidePopup } = actions
export default reducer