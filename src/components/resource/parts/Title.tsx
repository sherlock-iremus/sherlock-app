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
            {/* <div className="relative bg-stone-50 border-1 border-stone-100">
                <div className="top-[-9px] left-[-7px] absolute font-['Moder-DOS-437']">╔</div>
                <div className="top-[-9px] right-[-7px] absolute font-['Moder-DOS-437']">╗</div>
                <div className="bottom-[-13px] left-[-7px] absolute font-['Moder-DOS-437']">╚</div>
                <div className="right-[-7px] bottom-[-13px] absolute font-['Moder-DOS-437']">╝</div> */}
            <div className="flex flex-col gap-3 bg-stone-50 p-3 font-serif text-2xl text-center">
                {titles.map(t => <div key={t.type_type}>
                    <span className='font-bold'>{t.value}</span>
                    {t.type_type && <>&nbsp;<span className='italic lowercase'>({t.type_type})</span></>}
                </div>)}
            </div>
            {/* </div> */}
        </>
        : ''
}

export default X