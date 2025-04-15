import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from 'react-redux'

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

import { store } from '@/app/store'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter basename='/sherlock/'>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
);
