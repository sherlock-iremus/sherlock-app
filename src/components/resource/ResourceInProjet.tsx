import ClipboardButton from '@/components/common/ClipboardButton'
import SherlockBar from '@/components/deco/SherlockBar'
import ProjectHeader from '@/components/layout/ProjectHeader'
import Resource from '@/components/resource/Resource'
import { ProjectIdData } from "@/utils/project"
import { ReactElement } from 'react'

interface Props {
    projectIdData: ProjectIdData
    resourceUri: string
    resourceBusinessId?: string
    customParts: ReactElement[]
}

const ResourceInProject: React.FC<Props> = ({ projectIdData, resourceUri, customParts }) => {
    return (
        <>
            {projectIdData.code && <ProjectHeader
                code={projectIdData.code}
                emoticon={projectIdData.emoticon}
                logo={projectIdData.logo}
                name={projectIdData.name}
                uuid={projectIdData.uuid}
            />}
            <SherlockBar />
            <Resource resourceUri={resourceUri} customParts={customParts} />
            <SherlockBar />
            <div className='bg-background px-6 py-4 text-foreground dark'>
                <h2 className='mb-1 font-mono text-stone-300 text-xs lowercase'>
                    URI de la ressource consultée :
                </h2>
                <div>
                    <h2
                        className='font-mono text-[aqua] text-link_negative'
                        style={{
                            textShadow: 'darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px'
                        }}
                    >
                        {resourceUri} <ClipboardButton content={resourceUri} />
                    </h2>
                </div>
            </div>
        </>
    )
}

export default ResourceInProject