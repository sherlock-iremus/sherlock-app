import { ReactElement } from 'react';
import { IdentityData } from '../../utils/bindings_helpers';
import { E55_TEI_FILE_URI, E55_FORGE_FILE_URI } from 'sherlock-rdf/lib/rdf-prefixes';
import { TEIHTMLRenderer } from '@/components/tei-html-renderer/TEIHTMLRenderer'
import { LuCodeXml } from 'react-icons/lu'
import { SparqlQueryResultObject_Binding } from 'sherlock-rdf/lib/sparql-result';

export function guessMediaRepresentation(idData: IdentityData, projectId: string | null): [string, ReactElement, string, ReactElement] | null {
  let teiFileUri = null
  let forgeFileUri = null

  // Guess media type
  for (const b of idData.identityBindings) {
    if (b.r_type_type && b.r_type_type.value === E55_TEI_FILE_URI) teiFileUri = b.label.value
    if (b.r_type_type && b.r_type_type.value === E55_FORGE_FILE_URI) forgeFileUri = b.label.value
  }

  if (teiFileUri && forgeFileUri) return [
    'Rendu du contenu TEI',
    <LuCodeXml />,
    forgeFileUri,
    <div className={'tei' + (projectId ? ` ${projectId}` : '')}>
      <TEIHTMLRenderer
        TEIDocumentURL={teiFileUri}
        setNote={(e: any) => console.log(e)}
      />
    </div>
  ]

  return null
}

export function sortBindingsFn(key: string): (a: SparqlQueryResultObject_Binding, b: SparqlQueryResultObject_Binding) => number {
  return function (a: SparqlQueryResultObject_Binding, b: SparqlQueryResultObject_Binding): number {
    if (a[key].value < b[key].value) return -1;
    if (a[key].value > b[key].value) return 1;
    return 0;
  }
}