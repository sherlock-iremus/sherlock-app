import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider, } from 'react-router-dom'

import './index.css'
import theme from './theme'
import { store } from './app/store'
import Editor from './components/editor/Editor'
import Explorer from './components/explorer/Explorer'

const router = createBrowserRouter([
  {
    path: '/explorer',
    element: <Explorer />
  },
  {
    path: '/editor',
    element: <Editor />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
