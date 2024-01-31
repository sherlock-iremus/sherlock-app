import { configureStore } from "@reduxjs/toolkit"

import { ontologiesSlice } from '../features/ontologies/ontologiesSlice'
import { resourcesSlice } from '../features/resources/resourcesSlice'
import { searchApiSlice } from '../features/search/searchApiSlice'
import { sparqlSlice } from '../features/sparql/sparqlSlice'
import { bnfSlice } from '../features/bnf/bnfSlice'
import { pokemonApi } from './services/pokemon'

export const store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [ontologiesSlice.name]: ontologiesSlice.reducer,
    [resourcesSlice.name]: resourcesSlice.reducer,
    [searchApiSlice.reducerPath]: searchApiSlice.reducer,
    [sparqlSlice.reducerPath]: sparqlSlice.reducer,
    [bnfSlice.reducerPath]: bnfSlice.reducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat([
    pokemonApi.middleware,
    searchApiSlice.middleware,
    sparqlSlice.middleware,
    bnfSlice.middleware,
  ]),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>