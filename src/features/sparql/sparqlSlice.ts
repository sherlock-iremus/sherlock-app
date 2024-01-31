import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const searchQuery = (search: string) => `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?s ?prefLabel
WHERE {
  GRAPH ?g {
    ?s a skos:Concept .
    ?s skos:prefLabel ?prefLabel .
    FILTER regex(?prefLabel, "${search}", "i") .
  }
}
`

export const sparqlSlice = createApi({
  reducerPath: 'sparqlApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3030/iremus'
  }),
  endpoints: builder => ({
    getSparqlResults: builder.query({
      query: (input) => ({
        url: '/sparql',
        method: 'POST',
        body: new URLSearchParams({ query: searchQuery(input) }),
      })
    })
  })
})

export const { useGetSparqlResultsQuery } = sparqlSlice