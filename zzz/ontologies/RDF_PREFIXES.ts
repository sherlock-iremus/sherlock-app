export const CIDOC_CRM = 'http://www.cidoc-crm.org/cidoc-crm/'

export const PREFIXES: Map<string, string> = new Map([
  ['http://purl.org/ontology/bibo/', 'bibo'],
  ['http://www.cidoc-crm.org/lrmoo/', 'lrmoo'],
  ['http://www.cidoc-crm.org/cidoc-crm/', 'crm'],
  ['http://www.cidoc-crm.org/crmdig/', 'crmdig'],
  ['http://purl.org/dc/elements/1.1/', 'dc'],
  ['http://purl.org/dc/terms/', 'dcterms'],
  ['http://xmlns.com/foaf/0.1/', 'foaf'],
  ['http://data-iremus.huma-num.fr/ns/hemef#', 'hemef'],
  ['http://data-iremus.huma-num.fr/files/', 'iremus_files'],
  ['http://data-iremus.huma-num.fr/id/', 'iremus'],
  ['http://data-iremus.huma-num.fr/ns/', 'iremus_ns'],
  ['http://data-iremus.huma-num.fr/graph/', 'iremus_graph'],
  ['http://data-iremus.huma-num.fr/ns/musrad30#', 'musrad30'],
  ['http://www.w3.org/2002/07/owl#', 'owl'],
  ['http://www.w3.org/1999/02/22-rdf-syntax-ns#', 'rdf'],
  ['http://www.w3.org/2000/01/rdf-schema#', 'rdfs'],
  ['http://schema.org/', 'schema'],
  ['http://www.w3.org/2004/02/skos/core#', 'skos'],
])

export function getPrefix(uri: string) {
  for (const [base_uri, prefix] of PREFIXES) {
    if (uri.startsWith(base_uri))
      return prefix + ':' + uri.replace(base_uri, '')
  }
}