import Link from '@/components/Link'
import { CRM_BASE, PrefixedUri, RDF_BASE, RDF_PREFIXES, RDFS_BASE, SKOS_BASE, IREMUS_NS_BASE } from 'sherlock-rdf/lib/rdf-prefixes'

export function makeClickablePrefixedUri(uri: string, pu: PrefixedUri, key: string = '') {
  return (
    <Link href={'/?resource=' + uri}>
      <span className='whitespace-nowrap' key={key}>
        {
          pu.prefix ?
            <>
              <span>{pu.prefix}</span>
              <span>:</span>
              <span>{pu.localPart}</span>
            </>
            :
            <span>{pu.localPart}</span>
        }
      </span>
    </Link>
  )
}

export function makeNonClickablePrefixedUri(
  pu: PrefixedUri,
  key: string = ''
) {
  return pu.prefix ? (
    <span key={key}>
      <span className='text-uri_prefix'>{pu.prefix}</span>
      <span className='text-uri_column'>:</span>
      <span className='text-uri_localpart'>{pu.localPart}</span>
    </span>
  ) : (
    <span key={key}>
      <span className='text-uri_localpart'>{pu.localPart}</span>
    </span>
  )
}

export function getReadableClass(pu: PrefixedUri): string {
  switch (pu.prefix) {
    case RDF_PREFIXES.get(CRM_BASE):
      switch (pu.localPart) {
        case 'E21_Person': return 'Personne'
        case 'E41_Appellation': return 'Appellation'
        case 'E42_Identifier': return 'Identifiant'
      }
  }

  return ''
}

export function getReadablePredicate(pu: PrefixedUri): string {
  switch (pu.prefix) {
    case RDF_PREFIXES.get(CRM_BASE):
      switch (pu.localPart) {
        case 'P1_is_identified_by': return 'a pour identifiant'
        case 'P2_has_type': return 'a pour type'
        case 'P71_lists': return 'liste'
        case 'P190_has_symbolic_content': return 'a pour contenu symbolique'
        case 'P102_has_title': return 'a pour titre'
      }
      break
    case RDF_PREFIXES.get(RDF_BASE):
      switch (pu.localPart) {
        case 'type': return 'a pour classe'
      }
      break
    case RDF_PREFIXES.get(RDFS_BASE):
      switch (pu.localPart) {
        case 'label': return 'a pour libellé générique'
      }
      break
    case RDF_PREFIXES.get(SKOS_BASE):
      switch (pu.localPart) {
        case 'prefLabel': return 'a pour libellé préféré'
        case 'altLabel': return 'a pour libellé alternatif'
      }
      break
    case RDF_PREFIXES.get(IREMUS_NS_BASE):
      switch (pu.localPart) {
        case 'hasContextProject': return 'a pour projet contexte'
      }
  }

  return ''
}