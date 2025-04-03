import { Ontology, OntologyProperty } from 'sherlock-rdf/lib/ontology'

const RDFS_ONTOLOGY: Ontology = new Ontology('RDF')
export const RDFS_LABEL = new OntologyProperty(
  'http://www.w3.org/2000/01/rdf-schema#label',
  'rdfs:label',
  RDFS_ONTOLOGY
)

RDFS_ONTOLOGY.addProperty(RDFS_LABEL)

export default RDFS_ONTOLOGY

// import { Languages } from 'sherlock-rdf/lib/rdf-literal'

// export const RDFS_CLASS = 'http://www.w3.org/2000/01/rdf-schema#Class'
// export const RDFS_COMMENT = 'http://www.w3.org/2000/01/rdf-schema#comment'
// export const RDFS_DOMAIN = 'http://www.w3.org/2000/01/rdf-schema#domain'
// export const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label'
// export const RDFS_PROPERTY = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'
// export const RDFS_RANGE = 'http://www.w3.org/2000/01/rdf-schema#range'
// export const RDFS_SUBCLASSOF = 'http://www.w3.org/2000/01/rdf-schema#subClassOf'
// export const RDFS_SUBPROPRETYOF = 'http://www.w3.org/2000/01/rdf-schema#subPropertyOf'

// export function jsonldLabelsToMap(labels: Array<{ [key: string]: string; }>) {
//     const res = new Map<Languages, string>
//     if (!labels) return res

//     for (const label of labels) {
//         const lang_str: string = Object(label)["@language"]
//         const lang: Languages = Languages[lang_str as keyof typeof Languages]
//         res.set(lang, label["@value"])
//     }

//     return res
// }
