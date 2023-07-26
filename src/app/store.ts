import { configureStore } from "@reduxjs/toolkit"

import { ontologiesSlice } from '../features/ontologies/ontologiesSlice'
import { resourcesSlice } from '../features/resources/resourcesSlice'
import { pokemonApi } from './services/pokemon'

export const store = configureStore({
    reducer: {
        [pokemonApi.reducerPath]: pokemonApi.reducer,
        [ontologiesSlice.name]: ontologiesSlice.reducer,
        [resourcesSlice.name]: resourcesSlice.reducer
    },
    devTools: import.meta.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([
        pokemonApi.middleware
    ]),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>