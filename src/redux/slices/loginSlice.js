import {createSlice} from '@reduxjs/toolkit';

export const loginStateSlice = createSlice({
    name: 'loginState',
    initialState: {
        isAuth: false,
        userInfo: null,
        providerInfo: null,
    },
    reducers: {
        setIsAuth: (state, action) => {
            state.isAuth = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setProviderInfo: (state, action) => {
            state.providerInfo = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {setIsAuth, setUserInfo, setProviderInfo} = loginStateSlice.actions;

export default loginStateSlice.reducer;
