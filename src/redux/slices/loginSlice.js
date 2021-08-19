import { createSlice } from '@reduxjs/toolkit'

export const loginStateSlice = createSlice({
  name: 'loginState',
  initialState: {
    isAuth: false,
    userInfo: null
  },
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { setIsAuth, setUserInfo } = loginStateSlice.actions

export default loginStateSlice.reducer