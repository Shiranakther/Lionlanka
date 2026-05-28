import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (token) {
      dispatch(loadUser())
    }
  }, [dispatch, token])

  return { user, token, isAuthenticated, loading }
}
