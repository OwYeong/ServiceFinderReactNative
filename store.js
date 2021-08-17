import { configureStore } from '@reduxjs/toolkit'
import loginStateReducer  from '@slices/userSlice'
import appStateReducer  from '@slices/appSlice'

export default configureStore({
  reducer: {
      loginState: loginStateReducer,
      appState: appStateReducer
  }
})