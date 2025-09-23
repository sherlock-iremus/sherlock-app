import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { mg_livraisons } from 'sherlock-sparql-queries/lib/mg_livraisons'
import { makeYasguiButton } from '@/components/buttons'
import Link from '@/components/Link'
import { makeLink } from '@/features/business_id/helpers'
import { useMGLivraisonsQuery } from '@/hooks/sherlockSparql';

export default function () {
    const { data, isSuccess } = useMGLivraisonsQuery(mg_livraisons())

    return <div className='p-24 font-serif text-center'>
        <>
            <header className='textSection'>
                <h2 >Liste des {isSuccess && data.results.bindings.length} livraisons</h2>
                <br />
                <div className='flex justify-center'>{makeYasguiButton(mg_livraisons(), 'Requête SPARQL')}</div>
            </header>
            {!isSuccess ? '⏳' :
                <>
                    <Table aria-label="Livraisons du Mercure Galant">
                        <TableHeader>
                            <TableColumn>Date</TableColumn>
                            <TableColumn>Titre de la livraison</TableColumn>
                            <TableColumn>Nb d'articles</TableColumn>
                            <TableColumn>Lien</TableColumn>
                        </TableHeader>
                        <TableBody items={data?.results.bindings}>
                            {(item) => {
                                const link = makeLink(item['livraison_business_id'].value, 'livraison')
                                return <TableRow
                                    className='hover:bg-gray-100'
                                    key={item['livraison_business_id'].value}>
                                    <TableCell className='whitespace-nowrap'>{item['date'].value.slice(0, 7)}</TableCell>
                                    <TableCell>{item['livraison_titre'].value}</TableCell>
                                    <TableCell className='text-center'>{item['n_articles'].value}</TableCell>
                                    <TableCell className='font-mono text-xs whitespace-nowrap'>
                                        <Link href={link} target='_blank'>{link}</Link>
                                    </TableCell>
                                </TableRow>
                            }}
                        </TableBody>
                    </Table>
                </>}
        </>
    </div>
}