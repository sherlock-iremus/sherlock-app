// https://redux-toolkit.js.org/rtk-query/usage/queries

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { SparqlQueryResultObject } from "sherlock-rdf/lib/sparql-result"

export const sparqlApi = createApi({
    reducerPath: "sparqlApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://data-iremus.huma-num.fr/sparql/",
    }),
    endpoints: builder => ({
        getSparqlQueryResult: builder.query<SparqlQueryResultObject, string>({
            query: (query: string) => ({
                url: "",
                method: "POST",
                body: new URLSearchParams({ query }),
            }),
            transformResponse: (_: object): SparqlQueryResultObject => {
                return _ as SparqlQueryResultObject
            },
        }),
    }),
})