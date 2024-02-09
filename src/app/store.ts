import { configureStore } from "@reduxjs/toolkit"

import { ontologiesSlice } from '../features/ontologies/ontologiesSlice'
import { resourcesSlice } from '../features/resources/resourcesSlice'
import { sparqlSlice } from '../features/sparql/sparqlSlice'

export const store = configureStore({
  reducer: {
    [ontologiesSlice.name]: ontologiesSlice.reducer,
    [resourcesSlice.name]: resourcesSlice.reducer,
    [sparqlSlice.reducerPath]: sparqlSlice.reducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat([
    sparqlSlice.middleware,
  ]),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>