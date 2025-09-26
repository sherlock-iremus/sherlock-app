import Link from '@/components/Link'
import React from 'react'
import { projectLogo, projectName } from './markupHelpers';

interface Props {
    code?: string;
    logo?: string;
    name?: string;
    uuid?: string;
}

const ProjectHeader: React.FC<Props> = ({ code, logo, name }) =>
    <div className='flex gap-6 bg-background p-6 text-foreground light'>
        {logo && projectLogo(logo)}
        <div className='flex flex-col justify-end items-start'>
            {name && projectName(name)}
            <div className='mt-2 font-mono text-gray-500 text-xs lowercase'>
                page du projet :&nbsp;
                <Link className='text-xs' href={`projects/${code}/`} target='_blank'>{`/projects/${code}/`}</Link>
            </div>
        </div>
    </div >

export default ProjectHeader