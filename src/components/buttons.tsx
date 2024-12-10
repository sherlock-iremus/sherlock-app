import { Button, Link } from "@nextui-org/react"
import { ReactNode } from "react"
import { Tooltip } from "@nextui-org/tooltip"
import { TbHexagonLetterY } from 'react-icons/tb'

export function makeYasguiButton(sparqlQuery: string, content: string) {
    return makeNegativeButton(
        <TbHexagonLetterY className="text-lg" />,
        `https://yasgui.triply.cc/#query=${encodeURIComponent(sparqlQuery)}&endpoint=http%3A%2F%2Fdata-iremus.huma-num.fr%2Fsparql%2F&requestMethod=POST&tabTitle=Query&headers=%7B%7D&contentTypeConstruct=application%2Fn-triples%2C*%2F*%3Bq%3D0.9&contentTypeSelect=application%2Fsparql-results%2Bjson%2C*%2F*%3Bq%3D0.9&outputFormat=gchart`,
        content
    )
}

export function makeNegativeButton(icon: ReactNode, uri: string, content: string) {
    return <Tooltip content={content} delay={500}>
        <Button
            className="border-1 hover:border-cyan-300 bg-black hover:bg-teal-950 border-teal-900 text-teal-500 hover:text-teal-300 transition-all"
            isIconOnly
            radius='full'
            size="sm"
            href={uri} as={Link}
            isExternal
            startContent={icon}
        />
    </Tooltip>
}