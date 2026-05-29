import { useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { streamFromGemini } from '../services/geminiService'
import API from '../services/api'

const STORAGE_KEY = 'heritage_chat_history'

const getStoredMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const useChatbot = () => {
  const [messages, setMessages] = useState(getStoredMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // Silently fail if localStorage is full
    }
  }, [messages])

  const sendMessage = useCallback(
    async (promptText, displayUserText = null) => {
      if (!promptText.trim()) return

      const textToShow = displayUserText || promptText;

      const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: textToShow.trim(),
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const aiMessageId = (Date.now() + 1).toString()
        const initialAiMessage = {
          id: aiMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, initialAiMessage])

        let accumulatedContent = ''

        await streamFromGemini(promptText.trim(), messages, (chunk) => {
          accumulatedContent += chunk
          setMessages((prev) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          )
        })

        // If user is authenticated, save the chat to the backend
        if (isAuthenticated) {
          try {
            await API.post('/api/chats', {
              title: textToShow.trim().substring(0, 50),
              messages: [...messages, userMessage, { ...initialAiMessage, content: accumulatedContent }],
            })
          } catch {
            // Silently fail — chat is still saved locally
          }
        }
      } catch (err) {
        setError('Failed to get response. Please try again.')
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isAuthenticated]
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  }
}
