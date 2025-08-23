import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";

interface User{
    id:string,
    name:string,
    isAdmin?:boolean,
    email:string
}

interface AuthState{
    token:string | null;
    user: User | null;
}

const initialState:AuthState = {
    token:localStorage.getItem('userToken') || null,
    user:localStorage.getItem('userData')? JSON.parse(localStorage.getItem('userData') as string):null,}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        setCredentials:(state,action: PayloadAction<{token:string;user: User;}>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;

            localStorage.setItem('userToken', action.payload.token)
            localStorage.setItem('userData', JSON.stringify(action.payload.user))
        },
        logout:(state) => {
            state.token = null;
            state.user = null;

            localStorage.removeItem('userData');
            localStorage.removeItem('userToken');

        },
    },
});   

export const {setCredentials, logout} = authSlice.actions;

export default authSlice.reducer;