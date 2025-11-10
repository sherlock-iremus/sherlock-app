import SherlockBar from '@/components/deco/SherlockBar'
import { makeH2 } from '@/components/layout/markupHelpers'
import ProjectHeader from '@/components/layout/ProjectHeader'
import { useGetProjectByCodeQuery } from '@/hooks/sherlockSparql'
import { useLivraisonsQuery } from '@/specific-features/mercure-galant/hooks_sparql'
import { extractProjectData, getProjecCodeFromLocation } from '@/utils/project'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { PiBooksDuotone } from "react-icons/pi"
import { useLocation, useNavigate } from 'react-router-dom'


export default function () {
    const navigate = useNavigate()
    const projectCode = getProjecCodeFromLocation(useLocation())
    const { data: data_project } = useGetProjectByCodeQuery(projectCode)
    const projectData = extractProjectData(data_project)
    const { data, isSuccess, query } = useLivraisonsQuery()

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
            {makeH2(`Liste des ${data?.results?.bindings.length} livraisons`, <PiBooksDuotone />, query)}
            {!isSuccess ? '⏳' :
                <>
                    <Table
                        aria-label="Livraisons du Mercure Galant"
                        radius='none'
                        className='font-serif'
                        onRowAction={(key) => navigate('/projects/' + projectCode + '/livraisons/' + key)}
                    >
                        <TableHeader>
                            <TableColumn>Date</TableColumn>
                            <TableColumn>Titre</TableColumn>
                            <TableColumn>Sous-titre</TableColumn>
                            <TableColumn>Nb d'articles</TableColumn>
                        </TableHeader>
                        <TableBody items={data?.results.bindings}>
                            {(item) => {
                                return <TableRow
                                    className='hover:bg-gray-100'
                                    key={item['livraison_business_id'].value}>
                                    <TableCell className='whitespace-nowrap'>{item['livraison_business_id'].value.slice(0, 7)}</TableCell>
                                    <TableCell>{item['livraison_title'].value}</TableCell>
                                    <TableCell>{item['livraison_subtitle']?.value}</TableCell>
                                    <TableCell className='text-center'>{item['n_articles'].value}</TableCell>
                                </TableRow>
                            }}
                        </TableBody>
                    </Table>
                </>}
        </div>
    </>
}