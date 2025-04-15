import { Button, Link } from "@heroui/react"
import { ReactNode } from "react"
import { Tooltip } from "@heroui/tooltip"
import { TbHexagonLetterY } from 'react-icons/tb'
import { makeYasguiUri } from 'sherlock-sparql-queries/lib/yasgui'

export function makeYasguiButton(sparqlQuery: string, content: string) {
    return makeNegativeButton(
        <TbHexagonLetterY className="text-lg" />,
        makeYasguiUri(sparqlQuery),
        content
    )
}

export function makeNegativeButton(icon: ReactNode, uri: string, content: string) {
    return <Tooltip className="text-xs" content={content} delay={500}>
        <Button
            className="flex bg-black hover:bg-teal-950 border-1 hover:border-cyan-300 border-teal-900 rounded-full w-8 h-8 text-teal-500 hover:text-teal-300 transition-all"
            isIconOnly
            radius="full"
            size="sm"
            href={uri} as={Link}
            isExternal
            startContent={icon}
        />
    </Tooltip>
}