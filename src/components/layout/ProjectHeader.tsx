import { projectLogo, projectName } from '@/components/layout/markupHelpers';
import { ProjectIdData } from '@/utils/project';
import React from 'react';
// import { Link } from '@heroui/react'
// import { linkStyles } from '@/styles/variants/link';

const ProjectHeader: React.FC<ProjectIdData> = ({ code, emoticon, logo, name }) =>
    <div className='flex gap-6 p-6 text-foreground sbg-background light'>
        {logo && projectLogo(logo)}
        <div className='flex flex-col justify-end items-start'>
            {name && projectName(name + (emoticon ? ` ${emoticon}` : ''))}
            {/* <div className='mt-2 font-mono text-text-secondary-foreground text-xs lowercase'>
                page du projet :&nbsp;
                <Link
                    className={linkStyles({ textSize: 'xs', letterSpacing: 'normal', fontWeight: 'light' })}
                    href={`/projects/${code}/`}
                    target='_blank'
                >
                    {`/projects/${code}/`}
                </Link>
            </div> */}
        </div>
    </div >

export default ProjectHeader