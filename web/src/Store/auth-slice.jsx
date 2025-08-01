import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const tokenFromCookie = Cookies.get('token');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: tokenFromCookie || null,
        isAuthenticated: !!tokenFromCookie,
        user: null, // optional future use
    },
    reducers: {
        login(state, action) {
            const { token } = action.payload;
            state.token = token;
            state.isAuthenticated = true;
            Cookies.set('token', token, { expires: 7 });
        },
        logout(state) {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            Cookies.remove('token');
        },
        setUser(state, action) {
            state.user = action.payload;
        },
    },
});

export const authActions = authSlice.actions;
export default authSlice;
