import cidoc_crm_data from '../../data/ontologies/json/CIDOC_CRM_v7.1.2.json'
import { Ontology } from 'sherlock-rdf/lib/ontology'
import { parseCRMOntology } from './helpers'

export const CIDOC_CRM_ONTOLOGY: Ontology = parseCRMOntology('CIDOC-CRM', cidoc_crm_data)
CIDOC_CRM_ONTOLOGY.sortAll()