import { Link } from '@heroui/react'
import React from 'react'

interface Props {
    code?: string;
    logo?: string;
    name?: string;
    uuid?: string;
}

const ProjectHeader: React.FC<Props> = ({ code, logo, name, uuid }) => <div className='flex gap-4 bg-background p-4 text-foreground light'>
    <img className='max-h-[111px]' src={logo} />
    <div className='flex flex-col justify-end items-start'>
        <div className='font-mono text-gray-500 text-xs lowercase'>Projet :</div>
        <div className='font-serif text-2xl'>{name} ffi st ct</div>
        <Link href={'/id/' + uuid}>{`/p/${code}/`}</Link>
    </div>
</div >


export default ProjectHeader