import { Accordion, AccordionItem, Button } from "@nextui-org/react"
import { FaRegPaste } from "react-icons/fa6"
import { SparqlQuery } from "./SparqlQuery"


type MyCodeProps = {
    code: string
}

type QueriesConsumerProps = {
    queries: SparqlQuery[]
}

export default function QueriesAccordion({ queries }: QueriesConsumerProps) {
    let key = 0

    return <Accordion
        variant="shadow"
        showDivider={false}
        className="p-2 rounded-none accordion"
        itemClasses={{
            base: "",
            title: "text-small",
            trigger: "data-[hover=true]:bg-default-100 flex h-10 items-center pr-2 rounded-lg",
            indicator: "text-medium",
            content: "text-small",
        }}
    >
        {queries.map(q => {
            const MyCode = ({ code }: MyCodeProps) => {
                return <pre className="p-3 w-full bg-gradient-to-r from-blue-600 via-pink-500 to-orange-500 text-transparent bg-clip-text select-none">
                    <Button className="h-8 float-right"
                        isIconOnly
                        onClick={async () => {
                            await navigator.clipboard.writeText(q.code)
                        }}><FaRegPaste /></Button>
                    {code}
                </pre>
            }

            return <AccordionItem
                key={key++}
                textValue={q.title}
                title={
                    <div className="px-3 flex flex-row items-center w-full">
                        <div className="flex flex-row items-center">{q.icon}</div>
                        <div className="flex flex-row items-center ml-2 flex-1">{q.title}</div>
                    </div>
                }
            >
                {q.node && q.node}
                {q.code && <MyCode code={q.code} />}
            </AccordionItem>
        })}
    </Accordion>
}