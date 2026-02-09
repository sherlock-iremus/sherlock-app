import Link from '@/components/buttons-and-links/Link';
import { projectLogo, projectName } from '@/components/layout/markupHelpers';
import { ProjectIdData } from '@/utils/project';
import React from 'react';

const ProjectHeader: React.FC<ProjectIdData> = ({ code, emoticon, logo, name }) =>
    <div className='flex gap-6 bg-background p-6 text-foreground light'>
        {logo && projectLogo(logo)}
        <div className='flex flex-col justify-end items-start'>
            {name && projectName(name + (emoticon ? ` ${emoticon}` : ''))}
            <div className='mt-2 font-mono text-gray-500 text-xs lowercase'>
                page du projet :&nbsp;
                <Link href={`/projects/${code}/`} target='_blank'>{`/projects/${code}/`}</Link>
            </div>
        </div>
    </div >

export default ProjectHeader