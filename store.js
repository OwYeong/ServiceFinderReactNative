import { configureStore } from '@reduxjs/toolkit'
import loginStateReducer  from '@slices/loginSlice'
import appStateReducer  from '@slices/appSlice'

export default configureStore({
  reducer: {
      loginState: loginStateReducer,
      appState: appStateReducer
  }
})