import { Ontology, OntologyProperty } from 'sherlock-rdf/lib/ontology'

const RDF_ONTOLOGY: Ontology = new Ontology('RDF')
export const RDF_TYPE = new OntologyProperty(
  'https://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'rdf:type',
  RDF_ONTOLOGY,
)

RDF_ONTOLOGY.addProperty(RDF_TYPE)

export default RDF_ONTOLOGY