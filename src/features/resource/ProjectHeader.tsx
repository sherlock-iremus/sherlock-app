import Link from '@/components/Link'
import React from 'react'

interface Props {
    code?: string;
    logo?: string;
    name?: string;
    uuid?: string;
}

const ProjectHeader: React.FC<Props> = ({ code, logo, name, uuid }) => <div className='flex gap-6 bg-background p-6 text-foreground light'>
    <img className='max-h-[111px]' src={logo} />
    <div className='flex flex-col justify-end items-start'>
        <h1 className='font-serif font-bold text-3xl'>{name}</h1>
        <div className='font-mono text-gray-500 text-xs lowercase'>
            lien vers le projet : <Link className='text-xs' href={'/id/' + uuid}>{`/p/${code}/`}</Link>
        </div>
    </div>
</div >


export default ProjectHeader