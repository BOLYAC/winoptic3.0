import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: User |null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  resetTokens: { [email: string]: string }
}



interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  resetTokens: {}
}

// Simulated API call for login
const loginApi = async (credentials: LoginCredentials): Promise<User> => {
  
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    return { id: '1', name: 'John Doe', email: credentials.email }
  }
  throw new Error('Email or password incorrect')
}

// Simulated API call for register
const registerApi = async (credentials: RegisterCredentials): Promise<User> => {
  
  await new Promise(resolve => setTimeout(resolve, 1000)) 
  return { id: '2', name: credentials.name, email: credentials.email }
}



export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const user = await registerApi(credentials)
      localStorage.setItem('authToken', 'dummy-token') 
      return user
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await loginApi(credentials)
      localStorage.setItem('authToken', 'dummy-token') 
      return user
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

// Simulated API call for password reset request
const requestResetApi = async (email: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  const token = Math.random().toString(36).substr(2, 10)
  console.log(`Reset token for ${email}: ${token}`)
  return token
}

// Simulated API call for password reset
const resetPasswordApi = async (token: string, newPassword: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  console.log(`Password reset with token ${token} to new password: ${newPassword}`)
}

export const requestReset = createAsyncThunk(
  'auth/requestReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const token = await requestResetApi(email)
      return { email, token }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }: { token: string; newPassword: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      const email = Object.keys(state.auth.resetTokens).find(key => state.auth.resetTokens[key] === token)
      if (!email) {
        throw new Error('Invalid or expired token')
      }
      await resetPasswordApi(token, newPassword)
      return email
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('authToken')
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.loading = false
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    .addCase(register.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.loading = false
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
    .addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false
      state.user = null
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default authSlice.reducer