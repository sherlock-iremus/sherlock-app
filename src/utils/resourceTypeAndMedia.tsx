import { TEIHTMLRenderer } from '@/components/tei-html-renderer/TEIHTMLRenderer'
import { IdentityData } from '@/utils/bindingsHelpers'
import { ReactElement } from 'react'
import { LuCodeXml } from 'react-icons/lu'
import { E55_FORGE_FILE_URI, E55_TEI_FILE_URI } from 'sherlock-rdf/lib/rdf-prefixes'

export enum ResourceType {
  Project,
  MEI,
  TEI,
  Picture,
}

export type MediaRepresentation = {
  title: string
  icon: ReactElement
  fileUri: string
  forgeFileUri: string
  component: ReactElement
}

export function guessMediaRepresentation(idData: IdentityData, projectId: string | null): MediaRepresentation | undefined {
  let teiFileUri = null
  let forgeFileUri = null

  // Guess media type
  for (const b of idData.identityBindings) {
    if (b.r_type_type && b.r_type_type.value === E55_TEI_FILE_URI) teiFileUri = b.label.value
    if (b.r_type_type && b.r_type_type.value === E55_FORGE_FILE_URI) forgeFileUri = b.label.value
  }

  if (teiFileUri && forgeFileUri) return {
    title: 'Rendu du contenu TEI',
    icon: <LuCodeXml />,
    fileUri: teiFileUri,
    forgeFileUri: forgeFileUri,
    component: <div className={'tei' + (projectId ? ` ${projectId}` : '')}>
      <TEIHTMLRenderer
        TEIDocumentURL={teiFileUri}
        noteClickHandler={(e: any) => console.log('Note : ', e)}
      />
    </div>
  }

  return undefined
}