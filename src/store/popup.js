import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isVisible: false,
        popupName: null,
        popupMessage: {
            icon: null,
            text: null,
            visible: null,
            buttonText: undefined
        }
    },
    reducers: {
        showPopup(state, action) {
            state.popupName = action.payload;
            state.isVisible = true;
        },
        hidePopup(state) {
            state.popupName = null;
            state.isVisible = false;
        },
        showMessage(state, action) {
            const { payload } = action
            state.popupMessage = {
                text: typeof payload === 'string' ? payload : payload.text,
                icon: payload.icon || null,
                buttonText: payload.buttonText || undefined,
                visible: true
            }
        },
        hideMessage(state) {
            state.popupMessage.visible = false
        }
    }
})

const { actions, reducer } = modalSlice
export const { showPopup, hidePopup, showMessage, hideMessage } = actions
export default reducer