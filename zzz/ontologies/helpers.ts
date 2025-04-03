import { RDFS_CLASS, RDFS_COMMENT, RDFS_DOMAIN, RDFS_LABEL, RDFS_PROPERTY, RDFS_RANGE, RDFS_SUBCLASSOF, jsonldLabelsToMap } from '../../constants/RDFS'
import { CIDOC_CRM } from '../../constants/RDF_PREFIXES'
import { Ontology, OntologyClass, OntologyProperty } from 'sherlock-rdf/lib/ontology'
import { OWL_INVERSEOF } from '../../constants/OWL'

export function extractCRMCode(uri: string): number {
  return parseInt(uri.split('/').slice(-1)[0].split('_')[0].slice(1))
}

export function parseCRMOntology(name: string, data: any) {
  const ontology = new Ontology(name)

  const caches = new Map<string, Map<string, string | Array<string>>>([
    [RDFS_SUBCLASSOF, new Map<string, Array<string>>()],
    [RDFS_DOMAIN, new Map<string, string>()],
    [OWL_INVERSEOF, new Map<string, string>()],
    [RDFS_RANGE, new Map<string, string>()]
  ])

  for (var resource of data) {
    const type = resource['@type'][0]
    const id = resource['@id']
    switch (type) {
      case RDFS_CLASS:
        const classe = new OntologyClass(
          id,
          id.replace(CIDOC_CRM, '').replaceAll('_', ' '),
          ontology,
        )
        classe.comment = jsonldLabelsToMap(resource[RDFS_COMMENT])
        classe.intCodeForSorting = extractCRMCode(id)
        classe.label = jsonldLabelsToMap(resource[RDFS_LABEL])
        ontology.addClass(classe)
        caches.get(RDFS_SUBCLASSOF)?.set(classe.uri, resource[RDFS_SUBCLASSOF]?.map((_: any) => _['@id']))
        break;
      case RDFS_PROPERTY:
        const property = new OntologyProperty(
          id,
          id.replace(CIDOC_CRM, '').replaceAll('_', ' '),
          ontology,
        )
        property.comment = jsonldLabelsToMap(resource[RDFS_COMMENT])
        property.intCodeForSorting = extractCRMCode(id)
        property.label = jsonldLabelsToMap(resource[RDFS_LABEL])
        ontology.addProperty(property)
        caches.get(RDFS_DOMAIN)?.set(property.uri, resource[RDFS_DOMAIN]?.[0]['@id'])
        caches.get(OWL_INVERSEOF)?.set(property.uri, resource[OWL_INVERSEOF]?.[0]['@id'])
        caches.get(RDFS_RANGE)?.set(property.uri, resource[RDFS_RANGE]?.[0]['@id'])
        break;
    }
  }

  for (const [subclassURI, superclassURI] of caches.get(RDFS_SUBCLASSOF) || []) {
    if (superclassURI) {
      const cSubject = ontology.classesRegistry.get(subclassURI)
      for (const cObjectUri of superclassURI) {
        const cObject = ontology.classesRegistry.get(cObjectUri)
        cObject && cSubject?.addSubClassOf(cObject)
      }
    }
  }

  for (const [propertyURI, classURI] of caches.get(RDFS_DOMAIN) || []) {
    const property = ontology.propertiesRegistry.get(propertyURI) as OntologyProperty
    const classe: OntologyClass = ontology.classesRegistry.get(classURI as string) as OntologyClass
    if (property != undefined)
      property.domain = classe as OntologyClass
  }

  for (const [propertyURI, classURI] of caches.get(RDFS_RANGE) || []) {
    const property = ontology.propertiesRegistry.get(propertyURI) as OntologyProperty
    const classe = ontology.classesRegistry.get(classURI as string) as OntologyClass
    if (property != undefined)
      property.range = classe
  }

  for (const [property1URI, property2URI] of caches.get(OWL_INVERSEOF) || []) {
    const property1 = ontology.propertiesRegistry.get(property1URI) as OntologyProperty
    const property2 = ontology.propertiesRegistry.get(property2URI as string) as OntologyProperty
    property1.inverseOf = property2
  }

  return ontology
}