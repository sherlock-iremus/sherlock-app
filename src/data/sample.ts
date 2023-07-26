import { Languages, Literal, Resource, OG, XSDTypes } from '../model/Resource'
import { RDF_TYPE } from './ontologies/RDF'
import { RDFS_LABEL } from './ontologies/RDFS'
import { CIDOC_CRM_ONTOLOGY } from '../data/ontologies/CIDOC-CRM'

export const sample_resource: Resource = new Resource('http://data-iremus.huma-num.fr/id/82c26710-3691-412f-8502-3cd78cc27434')
sample_resource.addPOG(RDF_TYPE, new OG(undefined, CIDOC_CRM_ONTOLOGY.classes[Math.floor(Math.random() * CIDOC_CRM_ONTOLOGY.classes.length)]))
sample_resource.addPOG(RDF_TYPE, new OG(undefined, CIDOC_CRM_ONTOLOGY.classes[Math.floor(Math.random() * CIDOC_CRM_ONTOLOGY.classes.length)]))
sample_resource.addPOG(RDFS_LABEL, new OG(new Literal(Languages.FR, XSDTypes.string, 'Coucou'), undefined))
sample_resource.addPOG(RDFS_LABEL, new OG(new Literal(Languages.DE, XSDTypes.string, 'Hallo'), undefined))