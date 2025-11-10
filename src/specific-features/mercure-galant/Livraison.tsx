import SherlockBar from '@/components/deco/SherlockBar'
import { makeH2 } from '@/components/layout/markupHelpers'
import ProjectHeader from '@/components/layout/ProjectHeader'
import { useGetProjectByCodeQuery } from '@/hooks/sherlockSparql'
import { useLivraisonQuery } from '@/specific-features/mercure-galant/hooks_sparql'
import { extractProjectData, getProjecCodeFromLocation } from '@/utils/project'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { PiNotebookDuotone } from "react-icons/pi"
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export default function () {
    const navigate = useNavigate()
    const projectCode = getProjecCodeFromLocation(useLocation())
    const { data: data_project } = useGetProjectByCodeQuery(projectCode)
    const projectData = extractProjectData(data_project)
    const { livraison } = useParams()
    const { data, query } = useLivraisonQuery(livraison || '')

    return <>
        <>
            {projectData.code && <ProjectHeader
                code={projectData.code}
                logo={projectData.logo}
                name={projectData.name}
                uuid={projectData.uuid}
            />}
            <SherlockBar />
        </>
        <div className='bg-background p-6 text-foreground light'>
            {makeH2(`Contenu de la livraison (${data?.results?.bindings.length} articles)`, <PiNotebookDuotone />, query)}
            {data?.results.bindings && <Table
                aria-label="Livraisons du Mercure Galant"
                className='font-serif'
                radius='none'
                onRowAction={(key) => navigate('/projects/' + projectCode + '/articles/' + key, { state: { uri: data?.results.bindings[0]['article'].value } })}
            >
                <TableHeader>
                    <TableColumn>Identifiant</TableColumn>
                    <TableColumn>Titre de l'article</TableColumn>
                    <TableColumn>Pagination</TableColumn>
                </TableHeader>
                <TableBody items={data?.results.bindings}>
                    {(item) => {
                        return <TableRow
                            className='hover:bg-gray-100'
                            key={item['article_business_id'].value}
                        >
                            <TableCell><span className='text-nowrap'>{item['article_business_id'].value}</span></TableCell>
                            <TableCell>
                                <div className='flex flex-col'>
                                    {'title_forge' in item && <div>{item['title_forge'].value} <span className='italic'>(titre forgé)</span></div>}
                                    {'title_courant' in item && <div>{item['title_courant'].value} <span className='italic'>(titre courant)</span></div>}
                                    {'title_paratexte' in item && <div>{item['title_paratexte'].value} <span className='italic'>(titre dans le paratexte)</span></div>}
                                </div>
                            </TableCell>
                            <TableCell><span className='text-nowrap'>{item['pagination'].value}</span></TableCell>
                        </TableRow>
                    }}
                </TableBody>
            </Table>}
        </div>
    </>
}