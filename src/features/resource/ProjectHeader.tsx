import { Link } from '@heroui/react';
import React from 'react'

interface Props {
    code?: string;
    logo?: string;
    name?: string;
    uuid?: string;
}

const ProjectHeader: React.FC<Props> = ({ code, logo, name, uuid }) => {
    return (
        <div className='flex gap-4 p-4 font-serif text-2xl'>
            <img src={logo} />
            <div className='flex flex-col justify-end'>
                <div className='font-mono text-gray-500 text-xs lowercase'>Projet :</div>
                <div className=''>{name}</div>
                <Link href={'id/' + uuid}>Page de présentation du projet</Link>
            </div>
        </div>
    )
}

export default ProjectHeader