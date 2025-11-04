import { mercure_galant_livraisons, mercure_galant_livraison } from 'sherlock-sparql-queries/lib/mercure_galant_livraisons'
import { baseSherlockUseSparqlQuery } from '@/hooks/sherlockSparql'

export const useLivraisonsQuery = () => {
    const query = mercure_galant_livraisons()
    const x = baseSherlockUseSparqlQuery(true, ['mercure-galant-livraisons'], query)
    return { query, ...x }
}

export const useLivraisonQuery = (livraisonBusinessId: string) => {
    const query = mercure_galant_livraison(livraisonBusinessId)
    const x = baseSherlockUseSparqlQuery(true, ['mercure-galant-livraison', livraisonBusinessId], query)
    return { query, ...x }
}