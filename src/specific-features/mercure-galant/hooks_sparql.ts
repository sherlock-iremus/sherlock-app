import { mg_livraisons, mg_livraison } from 'sherlock-sparql-queries/lib/mg_livraisons'
import { baseSherlockUseSparqlQuery } from '@/hooks/sherlockSparql'

export const useLivraisonsQuery = () => {
    const query = mg_livraisons()
    const x = baseSherlockUseSparqlQuery(true, ['mg-livraisons'], query)
    return { query, ...x }
}

export const useLivraisonQuery = (livraisonBusinessId: string) => {
    const query = mg_livraison(livraisonBusinessId)
    const x = baseSherlockUseSparqlQuery(true, ['mg-livraison', livraisonBusinessId], query)
    return { query, ...x }
}