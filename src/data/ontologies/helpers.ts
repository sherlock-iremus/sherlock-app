import { RDFS_CLASS, RDFS_COMMENT, RDFS_DOMAIN, RDFS_LABEL, RDFS_PROPERTY, RDFS_RANGE, RDFS_SUBCLASSOF, RDFS_SUBPROPRETYOF, jsonldLabelsToMap } from '../../constants/RDFS'
import { CIDOC_CRM } from '../../constants/RDF_PREFIXES'
import { Ontology, OntologyClass, OntologyProperty } from '../../model/Ontology'
import { OWL_INVERSEOF } from '../../constants/OWL'
import { extractCode } from '../../data/ontologies/CIDOC-CRM'

export function parseOntology(name: string, data: any) {
  const ontology = new Ontology(name)
  const caches = new Map<string, Map<string, string | Array<string>>>([
    [RDFS_SUBCLASSOF, new Map<string, Array<string>>()],
    [RDFS_DOMAIN, new Map<string, string>()],
    [OWL_INVERSEOF, new Map<string, string>()],
    [RDFS_RANGE, new Map<string, string>()]
  ])

  for (var _ of data) {
    const type = _['@type'][0]
    const id = _['@id']
    switch (type) {
      case RDFS_CLASS:
        const c = new OntologyClass(
          id,
          id.replace(CIDOC_CRM, '').replaceAll('_', ' '),
          ontology,
        )
        c.comment = jsonldLabelsToMap(_[RDFS_COMMENT])
        c.intCodeForSorting = extractCode(id)
        c.label = jsonldLabelsToMap(_[RDFS_LABEL])
        ontology.addClass(c)
        caches.get(RDFS_SUBCLASSOF)?.set(c.uri, _[RDFS_SUBCLASSOF]?.map((_: any) => _['@id']))
        break;
      case RDFS_PROPERTY:
        const p = new OntologyProperty(
          id,
          id.replace(CIDOC_CRM, '').replaceAll('_', ' '),
          ontology,
        )
        p.comment = jsonldLabelsToMap(_[RDFS_COMMENT])
        p.intCodeForSorting = extractCode(id)
        p.label = jsonldLabelsToMap(_[RDFS_LABEL])
        ontology.addProperty(p)
        caches.get(RDFS_DOMAIN)?.set(p.uri, _[RDFS_DOMAIN]?.[0]['@id'])
        caches.get(OWL_INVERSEOF)?.set(p.uri, _[OWL_INVERSEOF]?.[0]['@id'])
        caches.get(RDFS_RANGE)?.set(p.uri, _[RDFS_RANGE]?.[0]['@id'])
        break;
    }
  }

  for (const [cSubjectUri, cObjectUris] of caches.get(RDFS_SUBCLASSOF)) {
    if (cObjectUris) {
      const cSubject = ontology._classesRegistry.get(cSubjectUri)
      for (const cObjectUri of cObjectUris) {
        const cObject = ontology._classesRegistry.get(cObjectUri)
        cObject && cSubject?.addSubClassOf(cObject)
      }
    }
  }

  for (const [pSubjectUri, cObjectUri] of caches.get(RDFS_DOMAIN)) {
    const pSubject = ontology._propertiesRegistry.get(pSubjectUri)
    const cObject = ontology._classesRegistry.get(cObjectUri)
    pSubject.domain = cObject
  }

  for (const [pSubjectUri, cObjectUri] of caches.get(RDFS_RANGE)) {
    const pSubject = ontology._propertiesRegistry.get(pSubjectUri)
    const cObject = ontology._classesRegistry.get(cObjectUri)
    pSubject.range = cObject
  }

  for (const [pSubjectUri, pObjectUri] of caches.get(OWL_INVERSEOF)) {
    const pSubject = ontology._propertiesRegistry.get(pSubjectUri)
    const pObject = ontology._propertiesRegistry.get(pObjectUri)
    pSubject.inverseOf = pObject
  }

  return ontology
}