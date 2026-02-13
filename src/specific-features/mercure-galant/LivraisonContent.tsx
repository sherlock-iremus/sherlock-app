import { makeH2 } from "@/components/layout/markupHelpers"
import { ProjectIdData } from "@/utils/project"
import { PiNotebookDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useLivraisonQuery } from './hooks_sparql'
import BasicTanStackTable from "@/components/common/BasicTanStackTable"

interface Props {
    projectIdData: ProjectIdData
    resourceBusinessId: string
}

const LivraisonContent: React.FC<Props> = ({ projectIdData, resourceBusinessId }) => {
    const navigate = useNavigate()
    const { data, query } = useLivraisonQuery(resourceBusinessId || '')

    return <>
        {makeH2(`Contenu de la livraison (${data?.results?.bindings.length} articles)`, <PiNotebookDuotone />, query)}
        {data?.results.bindings && <BasicTanStackTable />
            // <Table
            //     aria-label="Livraisons du Mercure Galant"
            //     className='font-serif'
            //     radius='none'
            //     onRowAction={(key) => {
            //         navigate('/projects/' + projectIdData.code + '/articles/' + key)
            //     }}

            // >
            //     <TableHeader>
            //         <TableColumn>Identifiant</TableColumn>
            //         <TableColumn>Titre de l'article</TableColumn>
            //         <TableColumn>Pagination</TableColumn>
            //     </TableHeader>
            //     <TableBody items={data?.results.bindings}>
            //         {(item) => {
            //             return <TableRow
            //                 className='hover:bg-gray-100'
            //                 key={item['article_business_id'].value}
            //             >
            //                 <TableCell className='align-top'><span className='text-nowrap'>{item['article_business_id'].value}</span></TableCell>
            //                 <TableCell className='align-top'>
            //                     <div className='flex flex-col'>
            //                         {'title_forge' in item && <div>{item['title_forge'].value} <span className='italic'>(titre forgé)</span></div>}
            //                         {'title_courant' in item && <div>{item['title_courant'].value} <span className='italic'>(titre courant)</span></div>}
            //                         {'title_paratexte' in item && <div>{item['title_paratexte'].value} <span className='italic'>(titre dans le paratexte)</span></div>}
            //                     </div>
            //                 </TableCell>
            //                 <TableCell className='align-top'><span className='text-nowrap'>{item.hasOwnProperty('pagination') ? item['pagination'].value : ''}</span></TableCell>
            //             </TableRow>
            //         }}
            //     </TableBody>
            // </Table>
        }
    </>
}

export default LivraisonContent