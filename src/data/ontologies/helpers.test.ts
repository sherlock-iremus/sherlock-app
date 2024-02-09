import { expect, test } from 'vitest'
import { Ontology } from 'sherlock-rdf/lib/ontology'
import cidoc_crm_data from '../../data/ontologies/json/CIDOC_CRM_v7.1.2.json'
import { parseCRMOntology } from './helpers'

test('Test parseOntology', () => {
    const CIDOC_CRM_ONTOLOGY: Ontology = parseCRMOntology('CIDOC-CRM', cidoc_crm_data)
    CIDOC_CRM_ONTOLOGY.sortAll()
    expect(CIDOC_CRM_ONTOLOGY.classes.length).toBe(76)
    expect(CIDOC_CRM_ONTOLOGY.properties.length).toBe(309)
})