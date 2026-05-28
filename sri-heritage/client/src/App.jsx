import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './hooks/useAuth'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'

// Chatbot
import ChatbotFAB from './components/chatbot/ChatbotFAB'

// Pages
import Home from './pages/Home'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import CreateArticle from './pages/CreateArticle'
import Places from './pages/Places'
import PlaceDetail from './pages/PlaceDetail'
import SavedArticles from './pages/SavedArticles'
import SavedChats from './pages/SavedChats'
import SearchResults from './pages/SearchResults'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import AboutSriLanka from './pages/AboutSriLanka'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminArticles from './pages/admin/AdminArticles'
import AdminPlaces from './pages/admin/AdminPlaces'
import AdminChats from './pages/admin/AdminChats'
import AdminHomePage from './pages/admin/AdminHomePage'

function App() {
  const location = useLocation()
  const { user, isAuthenticated, loading } = useAuth()

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/:slug" element={<PlaceDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<AboutSriLanka />} />

            {/* Protected Routes */}
            <Route
              path="/create-article"
              element={
                <ProtectedRoute>
                  <CreateArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-article/:id"
              element={
                <ProtectedRoute>
                  <CreateArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-articles"
              element={
                <ProtectedRoute>
                  <SavedArticles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-chats"
              element={
                <ProtectedRoute>
                  <SavedChats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="places" element={<AdminPlaces />} />
              <Route path="chats" element={<AdminChats />} />
              <Route path="homepage" element={<AdminHomePage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatbotFAB />}
    </>
  )
}

export default App
