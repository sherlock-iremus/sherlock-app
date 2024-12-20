import { Literal, Resource, OG, Graph } from 'sherlock-rdf/lib/resource'
import { Languages, XSDTypes } from 'sherlock-rdf/lib/rdf-literal'
import { RDF_TYPE } from './ontologies/RDF'
import { RDFS_LABEL } from './ontologies/RDFS'
import { CIDOC_CRM_ONTOLOGY } from '../features/ontologies/CIDOC-CRM'

const g = new Graph('http://data-iremus.huma-num.fr/graph/coucou')

export const sample_resource: Resource = new Resource('http://data-iremus.huma-num.fr/id/82c26710-3691-412f-8502-3cd78cc27434')
let aRandomNumber = Math.floor(Math.random() * CIDOC_CRM_ONTOLOGY.classes.length)
sample_resource.addPOG(RDF_TYPE, new OG(undefined, CIDOC_CRM_ONTOLOGY.classes[aRandomNumber]))
aRandomNumber = Math.floor(Math.random() * CIDOC_CRM_ONTOLOGY.classes.length)
sample_resource.addPOG(RDF_TYPE, new OG(undefined, CIDOC_CRM_ONTOLOGY.classes[aRandomNumber]))
sample_resource.addPOG(RDFS_LABEL, new OG(new Literal(Languages.FR, XSDTypes.string, 'Coucou'), undefined, g))
sample_resource.addPOG(RDFS_LABEL, new OG(new Literal(Languages.DE, XSDTypes.string, 'Hallo'), undefined, g))
sample_resource.addPOG(CIDOC_CRM_ONTOLOGY.properties[0], new OG(undefined, new Resource('http://www.example.com'), g))
sample_resource.addPOG(CIDOC_CRM_ONTOLOGY.properties[0], new OG(new Literal(Languages.DE, XSDTypes.string, 'VDjijigf'), undefined, g))