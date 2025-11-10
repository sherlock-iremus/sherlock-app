import SherlockBar from '@/components/deco/SherlockBar'
import { makeH2 } from '@/components/layout/markupHelpers'
import ProjectHeader from '@/components/layout/ProjectHeader'
import { useGetProjectByCodeQuery, useResourceIdentityQuery } from '@/hooks/sherlockSparql'
import { useLivraisonQuery } from '@/specific-features/mercure-galant/hooks_sparql'
import { extractProjectData, getProjecCodeFromLocation } from '@/utils/project'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'
import { PiLinkDuotone, PiNotebookDuotone } from "react-icons/pi"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Title from '@/components/resource/parts/Title'
import LinkButton from '@/components/buttons-and-links/LinkButton'

export default function () {
    const navigate = useNavigate()
    const projectCode = getProjecCodeFromLocation(useLocation())
    const { data: data_project } = useGetProjectByCodeQuery(projectCode)
    const projectData = extractProjectData(data_project)
    const { livraison } = useParams()
    const { data, query } = useLivraisonQuery(livraison || '')
    const resourceUri = data?.results.bindings[0]['livraison'].value
    const { data: dataId } = useResourceIdentityQuery(resourceUri)

    return <>
        <>
            {projectData.code && <ProjectHeader
                code={projectData.code}
                emoticon={projectData.emoticon}
                logo={projectData.logo}
                name={projectData.name}
                uuid={projectData.uuid}
            />}
            <SherlockBar />
        </>
        <div className='bg-background p-6 text-foreground light'>
            <div className='mt-6'>
                <Title idData={dataId} />
            </div>
            {makeH2(`Contenu de la livraison (${data?.results?.bindings.length} articles)`, <PiNotebookDuotone />, query)}
            {data?.results.bindings && <Table
                aria-label="Livraisons du Mercure Galant"
                className='font-serif'
                radius='none'
                onRowAction={(key) => {
                    const x = data.results.bindings.find(i => i['article_business_id'].value === key)
                    navigate('/projects/' + projectCode + '/articles/' + key, { state: { uri: x['article'].value } })
                }}

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
                            <TableCell className='align-top'><span className='text-nowrap'>{item['article_business_id'].value}</span></TableCell>
                            <TableCell className='align-top'>
                                <div className='flex flex-col'>
                                    {'title_forge' in item && <div>{item['title_forge'].value} <span className='italic'>(titre forgé)</span></div>}
                                    {'title_courant' in item && <div>{item['title_courant'].value} <span className='italic'>(titre courant)</span></div>}
                                    {'title_paratexte' in item && <div>{item['title_paratexte'].value} <span className='italic'>(titre dans le paratexte)</span></div>}
                                </div>
                            </TableCell>
                            <TableCell className='align-top'><span className='text-nowrap'>{item.hasOwnProperty('pagination') ? item['pagination'].value : ''}</span></TableCell>
                        </TableRow>
                    }}
                </TableBody>
            </Table>}
        </div>
        <SherlockBar />
        {resourceUri && <div className='bg-background px-6 py-4 text-foreground dark'>
            <h2 className='mb-1 font-mono text-stone-300 text-xs lowercase'>
                Consulter la ressource dans SHERLOCK :
            </h2>
            <div>
                <h2
                    className='font-mono text-[aqua] text-link_negative'
                    style={{
                        textShadow: 'darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px'
                    }}
                >
                    {resourceUri} <LinkButton icon={<PiLinkDuotone />} href={resourceUri} content={resourceUri} />
                </h2>
            </div>
        </div>}
    </>
}