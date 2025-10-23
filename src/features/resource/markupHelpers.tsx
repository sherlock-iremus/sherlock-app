import YasguiButton from '@/components/YasguiButton'
import React, { ReactElement } from 'react'
import { tv } from 'tailwind-variants'

const h2 = tv({
    base: 'font-light mb-6 mt-6 not-first:mt-12 text-2xl font-sans tracking-wider items-center lowercase text-teal-500 flex gap-4'
})

export function makeH2(title: string, icon: React.ReactElement, sparqlQuery?: string, link?: ReactElement): React.ReactElement {
    return <h2 className={h2()}>
        {icon}
        {title}
        {sparqlQuery && <YasguiButton query={sparqlQuery} />}
        {link && link}
    </h2>
}

export function projectName(name: string): React.ReactElement {
    return <h1 className='font-["Jost"] font-extralight text-teal-800 text-3xl uppercase tracking-wide'>{name}</h1>
}

export function projectLogo(logo: string): React.ReactElement {
    return <img className='max-h-[111px]' src={logo} />
}