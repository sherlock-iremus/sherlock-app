import { f } from 'sherlock-sparql-queries/lib/projectDataFields'
import PredicateSectionTitle from '../resource/PredicateSectionTitle'
import { useGetAllProjectDataQuery } from '@/hooks/sherlockSparql'

export default function () {
    const q = f("aam", "c583a908-30da-4d05-b0b1-dec8d3401a1e")
    const { data } = useGetAllProjectDataQuery(q, "c583a908-30da-4d05-b0b1-dec8d3401a1e")
    console.log(data)
    return <div>
        <PredicateSectionTitle direction={null} icon={null} link={null} title='Données' prefixedUri={null} sparqlQuery={q} n={null} />
    </div>
}