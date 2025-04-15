export function makeLink(business_id: string, type: string): string {
    const parts = business_id.split('/').filter(x => x)
    return `/${parts[0]}/${type}/${parts[1]}`
}