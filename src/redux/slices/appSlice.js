import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'appState',
  initialState: {
    isLoading: true,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {  setIsLoading } = appSlice.actions

export default appSlice.reducer