import Link from '@/components/Link'

export function makeUrlFromCrmCode(crmCode: string, word: string) {
    const u = 'https://cidoc-crm.org/html/cidoc_crm_v7.1.3.html#' + crmCode
    return <Link href={u} target="_blank"><span>{word}</span></Link >
}