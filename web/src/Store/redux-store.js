import { configureStore } from '@reduxjs/toolkit';

import { notificationSlice } from './notification-slice';

export const store = configureStore({
    reducer: notificationSlice.reducer,
});
