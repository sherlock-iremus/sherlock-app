export function extractCode(uri: string): number {
    return parseInt(uri.split('/').slice(-1)[0].split('_')[0].slice(1))
}