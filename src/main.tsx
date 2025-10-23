import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import App from "@/components/app/App.tsx"
import "@/styles/globals.css"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename='/sherlock/'>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode >,
)