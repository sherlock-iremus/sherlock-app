import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'

import { store } from '@/app/store'
import '@/app.css'
import App from '@/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter basename='/sherlock/'>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
)
