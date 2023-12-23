import { configureStore } from '@reduxjs/toolkit';

import { notificationSlice } from './notification-slice';
import { loaderSlice } from './loader-slice';
import { modalSlice } from './modal-slice';
export const store = configureStore({
    reducer: {
        notification: notificationSlice.reducer,
        loader: loaderSlice.reducer,
        modal: modalSlice.reducer,
    },
});
