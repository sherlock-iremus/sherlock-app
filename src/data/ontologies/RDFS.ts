import { Ontology, OntologyProperty } from '../../model/Ontology'

const RDFS_ONTOLOGY: Ontology = new Ontology('RDF')
export const RDFS_LABEL = new OntologyProperty(
  'http://www.w3.org/2000/01/rdf-schema#label',
  'rdfs:label',
  RDFS_ONTOLOGY,
)

RDFS_ONTOLOGY.addProperty(RDFS_LABEL)

export default RDFS_ONTOLOGY