import { makeH2 } from '@/components/layout/markupHelpers'
import { MdTitle } from "react-icons/md"
import { CRM_BASE } from "sherlock-rdf/lib/rdf-prefixes"
import { SparqlQueryResultObject } from "sherlock-rdf/lib/sparql-result"

interface Props {
    idData: SparqlQueryResultObject | undefined
}

interface Title {
    value: string
    type: string
    type_type: string
}

const X: React.FC<Props> = ({ idData }) => {
    const titles: Title[] = []

    if (idData?.results.bindings) {
        for (const b of idData?.results.bindings) {
            if (b.r_type?.value === CRM_BASE + 'E35_Title') {
                titles.push({
                    value: b.label.value,
                    type: b.r_type_type.value,
                    type_type: b.r_type_type_label.value
                })
            }
            if (b.p && b.p.value === CRM_BASE + 'P102_has_title' && !b.r_type) {
                titles.push({
                    value: b.label.value,
                    type: '',
                    type_type: ''
                })
            }
        }
    }

    return titles.length > 0
        ? <>
            {makeH2('titre de la ressource', <MdTitle />)}
            <div className="flex flex-col gap-3 p-3 border border-text-text-secondary-foreground font-serif text-2xl text-center">
                {titles.map(t => <div key={t.type_type}>
                    <div className='font-medium'>{t.value}</div>
                    {t.type_type && <div className='font-mono text-text-secondary-foreground text-sm lowercase'>[{t.type_type}]</div>}
                </div>)}
            </div>
        </>
        : ''
}

export default X