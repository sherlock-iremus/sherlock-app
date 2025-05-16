import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

import { store } from '@/app/store'
import { queryObjects } from "v8";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <BrowserRouter basename='/sherlock/'>
          <Provider>
            <App />
          </Provider>
        </BrowserRouter>
      </ReduxProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
