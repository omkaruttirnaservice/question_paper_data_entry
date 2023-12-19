import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState: {
        show: false,
        message: '',
    },
    reducers: {
        showNotification(state, action) {
            state.show = true;
            state.message = action.payload;
        },
        hideNotification(state, action) {
            state.show = false;
            state.message = '';
        },
    },
});

export const notificationActions = notificationSlice.actions;
