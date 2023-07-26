import cidoc_crm_data from '../../data/ontologies/json/CIDOC_CRM_v7.1.2.json'
import { parseOntology } from './helpers'
import { Ontology } from '../../model/Ontology'

export const CIDOC_CRM_ONTOLOGY: Ontology = parseOntology('CIDOC-CRM', cidoc_crm_data)
CIDOC_CRM_ONTOLOGY.sortAll()

export function extractCode(uri: string): number {
  return parseInt(uri.split('/').slice(-1)[0].split('_')[0].slice(1))
}