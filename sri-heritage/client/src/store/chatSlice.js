import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

// Async Thunks

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/api/chats')
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch chats')
    }
  }
)

export const fetchChat = createAsyncThunk(
  'chat/fetchChat',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/api/chats/${id}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch chat')
    }
  }
)

export const saveChat = createAsyncThunk(
  'chat/saveChat',
  async ({ title, messages }, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/api/chats', { title, messages })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save chat')
    }
  }
)

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/chats/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete chat')
    }
  }
)

export const togglePinChat = createAsyncThunk(
  'chat/togglePinChat',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/api/chats/${id}/pin`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to pin/unpin chat')
    }
  }
)

// Slice

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChat: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentChat: (state) => {
      state.currentChat = null
    },
    clearChatError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false
        state.chats = action.payload.chats || action.payload
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch Single Chat
      .addCase(fetchChat.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.loading = false
        state.currentChat = action.payload.chat || action.payload
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Save Chat
      .addCase(saveChat.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(saveChat.fulfilled, (state, action) => {
        state.loading = false
        const chat = action.payload.chat || action.payload
        state.chats.unshift(chat)
        state.currentChat = chat
      })
      .addCase(saveChat.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete Chat
      .addCase(deleteChat.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.loading = false
        state.chats = state.chats.filter((c) => c._id !== action.payload)
        if (state.currentChat?._id === action.payload) {
          state.currentChat = null
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Toggle Pin Chat
      .addCase(togglePinChat.fulfilled, (state, action) => {
        const updated = action.payload.chat || action.payload
        const index = state.chats.findIndex((c) => c._id === updated._id)
        if (index !== -1) state.chats[index] = updated
        if (state.currentChat?._id === updated._id) {
          state.currentChat = updated
        }
      })
  },
})

export const { clearCurrentChat, clearChatError } = chatSlice.actions
export default chatSlice.reducer
