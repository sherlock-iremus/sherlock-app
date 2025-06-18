import { RDF_BASE, sortBindings } from 'sherlock-rdf/lib/rdf-prefixes'
import { SparqlQueryResultObject, SparqlQueryResultObject_Binding } from "sherlock-rdf/lib/sparql-result"
import { IDENTITY_PREDICATES } from 'sherlock-sparql-queries/lib/identity'

export type IdentityData = {
    rdfTypes: string[],
    authdocBindings: SparqlQueryResultObject_Binding[],
    identityBindings: SparqlQueryResultObject_Binding[],
    identityPredicates: string[]
}

export function extractDataFromIdentityBindings(sqro: SparqlQueryResultObject | undefined): IdentityData {
    const x: IdentityData = {
        rdfTypes: [],
        authdocBindings: [],
        identityBindings: [],
        identityPredicates: []
    }

    if (sqro === undefined) return x

    for (const binding of sqro.results.bindings) {
        if (binding.hasOwnProperty('p')) {
            x.identityPredicates.push(binding['p'].value)
        }
        if (
            binding.hasOwnProperty('p')
            && binding['p'].value === RDF_BASE + 'type'
        ) {
            x.rdfTypes.push(binding['r'].value)
        }
        if (
            binding.hasOwnProperty('authdoc')
            && binding.hasOwnProperty('authdoc_label')
            && binding.hasOwnProperty('authdoc_g')
        ) {
            x.authdocBindings.push(binding)
        }
        else {
            x.identityBindings.push(binding)
        }
    }

    x.identityBindings = x.identityBindings.toSorted(sortBindings)

    return x
}

export type OutgoingPredicatesData = {
    highFanOutPredicatesBindings: SparqlQueryResultObject_Binding[],
    lowFanOutPredicates: string[]
}

export function extractDataFromOutgoingPredicatesCountSparqlQueryResult(sqro: SparqlQueryResultObject | undefined): OutgoingPredicatesData {
    const x: OutgoingPredicatesData = {
        highFanOutPredicatesBindings: [],
        lowFanOutPredicates: []
    }

    if (sqro === undefined) return x

    sqro.results.bindings.map(binding => {
        const n = parseInt(binding.c.value)
        if (n > 20) {
            x.highFanOutPredicatesBindings.push(binding)
        }
        if (n <= 20 && !IDENTITY_PREDICATES.includes(binding.lp.value)) {
            x.lowFanOutPredicates.push(binding.lp.value)
        }
    })

    return x
}

export function groupByLPLR(bindings: SparqlQueryResultObject_Binding[]): Record<string, any> {
    const x: Record<string, any> = {}

    for (const b of bindings) {
        if (!x[b.lp.value]) x[b.lp.value] = {}
        if (!x[b.lp.value][b.lr.value]) x[b.lp.value][b.lr.value] = []
        x[b.lp.value][b.lr.value].push(b)
    }

    // et on trie tous les bindings
    for (const lp in x) {
        for (const lr in x[lp]) {
            x[lp][lr] = x[lp][lr].toSorted(sortBindings)
        }
    }

    return x
}

export function groupByField(bindings: SparqlQueryResultObject_Binding[], field: string): Record<string, any> {
    const grouped: Record<string, any[]> = {};

    bindings.forEach(item => {
    if (item[field]) {
     const fieldValue = item[field] ? item[field].value : 'no-binding';
     if (!grouped[fieldValue]) {
       grouped[fieldValue] = [];
     }
     grouped[fieldValue].push(item);
    }
   });
   
   return grouped;
}