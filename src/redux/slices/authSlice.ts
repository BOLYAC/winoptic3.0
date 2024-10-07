import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
}

interface ResetToken {
  token: string
  expiresAt: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  resetTokens: { [email: string]: ResetToken }
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

// Simulated API call for password reset request
const requestResetApi = async (email: string): Promise<ResetToken> => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  const token = Math.random().toString(36).substr(2, 10)
  const expiresAt = Date.now() + 3600000 // Token expires in 1 hour
  return { token, expiresAt }
}

// Simulated API call for password reset
const resetPasswordApi = async (token: string, newPassword: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  console.log(`Password reset with token ${token} to new password: ${newPassword}`)
}

export const register = createAsyncThunk<User, RegisterCredentials, { rejectValue: string }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await registerApi(credentials)
      localStorage.setItem('authToken', 'dummy-token') 
      return user
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const login = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginApi(credentials)
      localStorage.setItem('authToken', 'dummy-token') 
      return user
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const requestReset = createAsyncThunk<{ email: string; resetToken: ResetToken }, string, { rejectValue: string }>(
  'auth/requestReset',
  async (email, { rejectWithValue }) => {
    try {
      const resetToken = await requestResetApi(email)
      return { email, resetToken }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const resetPassword = createAsyncThunk<string, { token: string; newPassword: string }, { state: { auth: AuthState }, rejectValue: string }>(
  'auth/resetPassword',
  async ({ token, newPassword }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const email = Object.keys(state.auth.resetTokens).find(key => state.auth.resetTokens[key].token === token)
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

export const logout = createAsyncThunk<void, void>(
  'auth/logout', 
  async () => {
    localStorage.removeItem('authToken')
  }
)

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
        state.error = action.payload ?? 'An error occurred during login'
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
        state.error = action.payload ?? 'An error occurred during registration'
      })
      .addCase(requestReset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestReset.fulfilled, (state, action: PayloadAction<{ email: string; resetToken: ResetToken }>) => {
        state.loading = false
        state.resetTokens[action.payload.email] = action.payload.resetToken
      })
      .addCase(requestReset.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'An error occurred while requesting password reset'
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
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        })
  },
})

export default authSlice.reducer