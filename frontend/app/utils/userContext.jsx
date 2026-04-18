'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const UserContext = createContext(null)

const buildHeaders = (headers = {}) => ({
  'Content-Type': 'application/json',
  ...headers,
})

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}

const fetchCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  })

  if (response.status === 401) {
    return null
  }

  const data = await parseResponse(response)
  return data.user
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch {
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const signUp = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await parseResponse(response)
    setUser(data.user)
    return data
  }

  const signIn = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: buildHeaders(),
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await parseResponse(response)
    setUser(data.user)
    return data
  }

  const signOut = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        refreshUser,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider.')
  }

  return context
}
