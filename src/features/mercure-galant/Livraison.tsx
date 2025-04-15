import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { mg_livraison } from 'sherlock-sparql-queries/lib/mg_livraisons'
import { sparqlApi } from '@/services/sparqlApi'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import Spinner from '@/components/Brent'
import { makeYasguiButton } from '@/components/buttons'
import { makeLink } from '@/features/business_id/helpers'

export default function () {
    const { livraison } = useParams()
    const livraisonBusinessId = '/mercure-galant/' + livraison

    const sparqlQuery = mg_livraison(livraisonBusinessId)
    const { data, isSuccess } = sparqlApi.endpoints.getSparqlQueryResult.useQuery(sparqlQuery)

    return <div className='p-24 font-serif text-center'>
        <>
            {!isSuccess ? <Spinner /> :
                <>
                    <header className='textSection'>
                        <h2>Contenu de la livraison : <em>« {data.results.bindings[0]['livraison_titre'].value} »</em></h2>
                        <br />
                        <div className='flex justify-center'>{makeYasguiButton(sparqlQuery, 'Requête SPARQL')}</div>
                    </header>
                    <Table aria-label="Livraisons du Mercure Galant">
                        <TableHeader>
                            <TableColumn>Titre de l'article</TableColumn>
                            <TableColumn>Lien</TableColumn>
                        </TableHeader>
                        <TableBody items={data?.results.bindings}>
                            {(item) => {
                                const link = makeLink(item['article_business_id'].value, 'article')
                                return <TableRow
                                    className='hover:bg-gray-100'
                                    key={item['article_business_id'].value}>
                                    <TableCell>{item['article_title'].value}</TableCell>
                                    <TableCell className='font-mono text-xs whitespace-nowrap'>
                                        <Link to={link} target='_blank'>
                                            {link}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            }}
                        </TableBody>
                    </Table>
                </>}
        </>
    </div>
}