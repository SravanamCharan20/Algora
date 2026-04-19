'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

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

const request = async (path, options = {}) => {
  const { body, headers, ...rest } = options
  const config = {
    credentials: 'include',
    ...rest,
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body)
    config.headers = buildHeaders(headers)
  } else if (headers) {
    config.headers = headers
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config)
  return parseResponse(response)
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
    const data = await request('/auth/signup', {
      method: 'POST',
      body: payload,
    })

    setUser(data.user)
    return data
  }

  const signIn = async (payload) => {
    const data = await request('/auth/signin', {
      method: 'POST',
      body: payload,
    })

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

  const listContests = async () => {
    const data = await request('/contests')
    return data.contests || []
  }

  const createContest = async (payload) => {
    const data = await request('/contests', {
      method: 'POST',
      body: payload,
    })

    return data.contest
  }

  const updateContest = async (contestId, payload) => {
    const data = await request(`/contests/${contestId}`, {
      method: 'PATCH',
      body: payload,
    })

    return data.contest
  }

  const startContest = async (contestId) => {
    const data = await request(`/contests/${contestId}/start`, {
      method: 'POST',
    })

    return data.contest
  }

  const stopContest = async (contestId) => {
    const data = await request(`/contests/${contestId}/stop`, {
      method: 'POST',
    })

    return data.contest
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        refreshUser,
        signIn,
        signUp,
        signOut,
        listContests,
        createContest,
        updateContest,
        startContest,
        stopContest,
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
