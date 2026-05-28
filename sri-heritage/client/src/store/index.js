import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import articlesReducer from './articlesSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articlesReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loadUser/fulfilled'],
      },
    }),
})
