from rdflib import Graph, plugin
from rdflib.serializer import Serializer

g = Graph()

g.parse('https://cidoc-crm.org/rdfs/7.1.2/CIDOC_CRM_v7.1.2.rdfs', format='application/rdf+xml')
g.serialize('json/CIDOC_CRM_v7.1.2.json', format='json-ld')

g.parse('https://cidoc-crm.org/rdfs/7.1.2/CIDOC_CRM_v7.1.2_PC.rdfs', format='application/rdf+xml')
g.serialize('json/CIDOC_CRM_v7.1.2_PC.json', format='json-ld')

g.parse('https://cidoc-crm.org/rdfs/7.1.2/CIDOC_CRM_v7.1.2_Supplement.rdfs', format='application/rdf+xml')
g.serialize('json/CIDOC_CRM_v7.1.2_Supplement.json', format='json-ld')
