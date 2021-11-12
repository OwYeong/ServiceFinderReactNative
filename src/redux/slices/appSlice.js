import {createSlice} from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'appState',
    initialState: {
        isLoading: true,
        loginBlock: false,
    },
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setLoginBlock: (state, action) => {
            state.loginBlock = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {setIsLoading, setLoginBlock} = appSlice.actions;

export default appSlice.reducer;
