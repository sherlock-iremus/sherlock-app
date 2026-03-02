import LinkButton from '@/components/common/LinkButton'
import NakalaPictures from '@/components/media-nakala-pictures/NakalaPictures'
import { TEIHTMLRenderer } from '@/components/tei-html-renderer/TEIHTMLRenderer'
import { IdentityData } from '@/utils/bindingsHelpers'
import { ReactElement } from 'react'
import { BsFiletypeXml } from 'react-icons/bs'
import { LuCodeXml } from 'react-icons/lu'
import { PiGitBranchDuotone, PiImageThin } from 'react-icons/pi'
import { CRM_BASE, DATA_IREMUS_ID_BASE, E55_FORGE_FILE_URI, E55_TEI_FILE_URI, RDF_BASE, E55_MEI_FILE_URI } from 'sherlock-rdf/lib/rdf-prefixes'
import MeiViewer from '../components/media-mei-viewer/MeiViewer'

const NAKALA_DOI_E42_UUID = '2e12e76e-d19b-4e22-92fe-a3e0766847f4'

export enum ResourceType {
  TEI,
  NakalaPictures,
}

export type MediaRepresentation = {
  title: string
  icon: ReactElement
  component: ReactElement,
  links: ReactElement
}

export function guessMediaRepresentation(idData: IdentityData, projectId: string | null): MediaRepresentation | undefined {
  let teiFileUri = null
  let meiUri = null
  let forgeFileUri = null
  let isE36: boolean = false
  let nakalaE42: string = ''

  for (const b of idData.identityBindings) {
    // TEI
    if (b.r_type_type && b.r_type_type.value === E55_TEI_FILE_URI) teiFileUri = b.label.value
    if (b.r_type_type && b.r_type_type.value === E55_FORGE_FILE_URI) forgeFileUri = b.label.value

    // E36 + Nakala
    if (b.p.value === RDF_BASE + 'type' && b.r.value === CRM_BASE + 'E36_Visual_Item') {
      isE36 = true
    }
    if (b.r_type_type?.value === DATA_IREMUS_ID_BASE + NAKALA_DOI_E42_UUID) {
      nakalaE42 = b.label.value
    }

    // MEI
    if (b.r_type_type && b.r_type_type.value === E55_MEI_FILE_URI) meiUri = b.label.value
  }

  if (teiFileUri && forgeFileUri) return {
    title: 'Rendu du contenu TEI',
    icon: <LuCodeXml />,
    component: <div className={'tei' + (projectId ? ` ${projectId}` : '')}>
      <TEIHTMLRenderer
        TEIDocumentURL={teiFileUri}
        noteClickHandler={(e: any) => console.log('Note : ', e)}
      />
    </div>,
    links: <>
      <LinkButton link={forgeFileUri} Icon={PiGitBranchDuotone} />
      <LinkButton link={teiFileUri} Icon={BsFiletypeXml} />
    </>
  }

  if (meiUri) return {
    title: 'Rendu du contenu MEI',
    icon: <LuCodeXml />,
    component: <MeiViewer meiUri={meiUri} />,
    links: < LinkButton link={meiUri} Icon={BsFiletypeXml} />
  }

  if (isE36 && nakalaE42) return {
    title: 'Images dans Nakala',
    icon: <LuCodeXml />,
    component: <NakalaPictures nakalaE42={nakalaE42} />,
    links: <LinkButton link={nakalaE42} Icon={PiImageThin} />
  }

  return undefined
}