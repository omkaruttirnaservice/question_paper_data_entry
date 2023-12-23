import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
    name: 'modal-slice',
    initialState: { isOpen: false, title: null, modalBody: null },
    reducers: {
        openModal(state, action) {
            state.isOpen = true;
        },
        closeModal(state, action) {
            state.isOpen = false;
        },
    },
});

export const modalActions = modalSlice.actions;
