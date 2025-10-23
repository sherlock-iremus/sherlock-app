import SherlockBar from '@/components/deco/SherlockBar'
import { extractProjectData, getProjecCodeFromLocation } from '@/components/projects/projectsDataHelpers'
import { makeH2 } from '@/components/zzz/markupHelpers'
import ProjectHeader from '@/components/zzz/ProjectHeader'
import { useGetProjectByCodeQuery } from '@/hooks/sherlockSparql'
import { useLivraisonQuery } from '@/specific-features/mercure-galant/hooks_sparql'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { PiNotebookDuotone } from "react-icons/pi"
import { useLocation, useParams } from 'react-router-dom'

export default function () {
    const projectCode = getProjecCodeFromLocation(useLocation())
    const { data: data_project } = useGetProjectByCodeQuery(projectCode)
    const projectData = extractProjectData(data_project)
    const { livraison } = useParams()
    console.log(1, livraison)
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
            {data?.results.bindings.length && makeH2(`Contenu de la livraison (${data?.results.bindings.length} articles)`, <PiNotebookDuotone />, query)}
            <Table aria-label="Livraisons du Mercure Galant" radius='none'>
                <TableHeader>
                    <TableColumn>Titre de l'article</TableColumn>
                    <TableColumn>Lien</TableColumn>
                </TableHeader>
                <TableBody items={data?.results.bindings}>
                    {(item) => {
                        return <TableRow
                            className='hover:bg-gray-100'
                            key={item['article_business_id'].value}
                        >
                            <TableCell>coucou</TableCell>
                            <TableCell className='font-mono text-xs whitespace-nowrap'>
                                coucou
                                {/* <Link href={link} target='_blank' className='text-sm'>
                                    {link}
                                </Link> */}
                            </TableCell>
                        </TableRow>
                    }}
                </TableBody>
            </Table>
        </div>
    </>
}