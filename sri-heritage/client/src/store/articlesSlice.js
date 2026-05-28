import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getArticlesAPI,
  getArticleAPI,
  createArticleAPI,
  updateArticleAPI,
  deleteArticleAPI,
  toggleLikeAPI,
  getMyArticlesAPI,
  getSavedArticlesAPI,
  saveArticleAPI,
  removeSavedArticleAPI,
} from '../services/articleService'

// Async Thunks

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ page, category, period, search, sort } = {}, { rejectWithValue }) => {
    try {
      const params = {}
      if (page) params.page = page
      if (category) params.category = category
      if (period) params.period = period
      if (search) params.search = search
      if (sort) params.sort = sort
      const { data } = await getArticlesAPI(params)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch articles')
    }
  }
)

export const fetchArticle = createAsyncThunk(
  'articles/fetchArticle',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await getArticleAPI(slug)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch article')
    }
  }
)

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await createArticleAPI(formData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create article')
    }
  }
)

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await updateArticleAPI(id, formData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update article')
    }
  }
)

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id, { rejectWithValue }) => {
    try {
      await deleteArticleAPI(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete article')
    }
  }
)

export const toggleLike = createAsyncThunk(
  'articles/toggleLike',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await toggleLikeAPI(id)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to toggle like')
    }
  }
)

export const fetchMyArticles = createAsyncThunk(
  'articles/fetchMyArticles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMyArticlesAPI()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch your articles')
    }
  }
)

export const fetchSavedArticles = createAsyncThunk(
  'articles/fetchSavedArticles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getSavedArticlesAPI()
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch saved articles')
    }
  }
)

export const saveArticle = createAsyncThunk(
  'articles/saveArticle',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await saveArticleAPI(id)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save article')
    }
  }
)

export const removeSavedArticle = createAsyncThunk(
  'articles/removeSavedArticle',
  async (id, { rejectWithValue }) => {
    try {
      await removeSavedArticleAPI(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove saved article')
    }
  }
)

// Slice

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    article: null,
    myArticles: [],
    savedArticles: [],
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {
    clearArticle: (state) => {
      state.article = null
    },
    clearArticlesError: (state) => {
      state.error = null
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.articles = action.payload.articles || action.payload
        state.page = action.payload.page || 1
        state.pages = action.payload.pages || 1
        state.total = action.payload.total || 0
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch Single Article
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false
        state.article = action.payload.article || action.payload
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Article
      .addCase(createArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false
        state.articles.unshift(action.payload.article || action.payload)
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update Article
      .addCase(updateArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload.article || action.payload
        const index = state.articles.findIndex((a) => a._id === updated._id)
        if (index !== -1) state.articles[index] = updated
        state.article = updated
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete Article
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false
        state.articles = state.articles.filter((a) => a._id !== action.payload)
        state.myArticles = state.myArticles.filter((a) => a._id !== action.payload)
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updated = action.payload.article || action.payload
        const index = state.articles.findIndex((a) => a._id === updated._id)
        if (index !== -1) state.articles[index] = updated
        if (state.article?._id === updated._id) state.article = updated
      })

      // Fetch My Articles
      .addCase(fetchMyArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyArticles.fulfilled, (state, action) => {
        state.loading = false
        state.myArticles = action.payload.articles || action.payload
      })
      .addCase(fetchMyArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch Saved Articles
      .addCase(fetchSavedArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSavedArticles.fulfilled, (state, action) => {
        state.loading = false
        state.savedArticles = action.payload.articles || action.payload
      })
      .addCase(fetchSavedArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Save Article
      .addCase(saveArticle.fulfilled, (state, action) => {
        const saved = action.payload.article || action.payload
        if (!state.savedArticles.find((a) => a._id === saved._id)) {
          state.savedArticles.push(saved)
        }
      })

      // Remove Saved Article
      .addCase(removeSavedArticle.fulfilled, (state, action) => {
        state.savedArticles = state.savedArticles.filter((a) => a._id !== action.payload)
      })
  },
})

export const { clearArticle, clearArticlesError, setPage } = articlesSlice.actions
export default articlesSlice.reducer
