import { ReactElement } from 'react';
import { IdentityData } from '../../utils/bindings_helpers';
import { CRM_BASE, IREMUS_RESOURCE_BASE } from 'sherlock-rdf/lib/rdf-prefixes';
import { TEIHTMLRenderer } from 'tei-html-renderer'
import { LuCodeXml } from 'react-icons/lu'

export function guessMediaRepresentation(idData: IdentityData): [string, ReactElement, string, ReactElement] | null {
  // Fetch identifier in project
  let identifier_in_project = null
  for (const b of idData.identityBindings) {
    if (b.r_type_type?.value === IREMUS_RESOURCE_BASE + '574ffe9e-525c-42f2-8188-329ba3c7231d') {
      identifier_in_project = b.label.value
      break
    }
  }

  // Guess media type
  for (const b of idData.identityBindings) {
    // Fichier TEI
    if (b.p.value === CRM_BASE + 'P2_has_type') {
      if (b.r.value === IREMUS_RESOURCE_BASE + '62b49ca2-ec73-4d72-aaf3-045da6869a15') {
        const teiUri = 'https://raw.githubusercontent.com/sherlock-iremus/mercure-galant-sources/refs/heads/main/tei/articles/' + identifier_in_project?.split('/')[2] + '.xml'
        const teiUriOnGithub = 'https://github.com/sherlock-iremus/mercure-galant-sources/blob/main/tei/articles/' + identifier_in_project?.split('/')[2] + '.xml'

        return [
          'Rendu du contenu TEI',
          <LuCodeXml />,
          teiUriOnGithub,
          <div className="tei">
            <TEIHTMLRenderer
              TEIDocumentURL={teiUri}
              setNote={(e: any) => console.log(e)}
            />
          </div>
        ]
      }
    }
  }
  return null
}