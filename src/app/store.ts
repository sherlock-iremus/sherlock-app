import { configureStore } from "@reduxjs/toolkit"

import { ontologiesSlice } from '../features/ontologies/ontologiesSlice'
import { resourcesSlice } from '../features/resources/resourcesSlice'
import { sparqlApi } from '../services/sparqlApi'

export const store = configureStore({
  reducer: {
    [ontologiesSlice.name]: ontologiesSlice.reducer,
    [resourcesSlice.name]: resourcesSlice.reducer,
    [sparqlApi.reducerPath]: sparqlApi.reducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat([
    sparqlApi.middleware,
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch