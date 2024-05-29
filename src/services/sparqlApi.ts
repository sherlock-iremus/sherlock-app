// https://redux-toolkit.js.org/rtk-query/usage/queries

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
    SparqlQueryResultObject,
    SparqlQueryResultObject_Binding,
} from "sherlock-rdf/lib/sparql-result"

export const sparqlApi = createApi({
    reducerPath: "sparqlApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://data-iremus.huma-num.fr/sparql/",
    }),
    endpoints: (builder) => ({
        getSparqlQueryResult: builder.query<SparqlQueryResultObject, string>({
            query: (query: string) => ({
                url: "",
                method: "POST",
                body: new URLSearchParams({ query }),
            }),
            transformResponse: (_) => _ as SparqlQueryResultObject,
        }),
        getFlattenedSparqlQueryResult: builder.query<any[], string>({
            query: (query: string) => ({
                url: "",
                method: "POST",
                body: new URLSearchParams({ query }),
            }),
            transformResponse: (response: SparqlQueryResultObject) =>
                response.results.bindings.map(
                    (binding: SparqlQueryResultObject_Binding) =>
                        Object.fromEntries(
                            Object.entries(binding).map(([key, { value }]) => [key, value])
                        )
                ),
        }),
    }),
})