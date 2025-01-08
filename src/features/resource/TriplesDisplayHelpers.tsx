import { Link } from 'react-router-dom'
import { CRM_BASE, PrefixedUri, RDF_BASE, RDF_PREFIXES } from 'sherlock-rdf/lib/rdf-prefixes'

export function makeClickablePrefixedUri(uri: string, pu: PrefixedUri, key: string = '') {
  return (
    <Link to={'/?resource=' + uri}>
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
  colors: string[],
  key: string = ''
) {
  return pu.prefix ? (
    <span key={key}>
      <span className={colors[0]}>{pu.prefix}</span>
      <span className={colors[1]}>:</span>
      <span className={colors[2]}>{pu.localPart}</span>
    </span>
  ) : (
    <span key={key}>
      <span className={colors[2]}>{pu.localPart}</span>
    </span>
  )
}

export function getReadablePredicate(pu: PrefixedUri): string {
  switch (pu.prefix) {
    case RDF_PREFIXES.get(CRM_BASE):
      switch (pu.localPart) {
        case 'P1_is_identified_by': return 'a pour identifiant'
        case 'P2_has_type': return 'a pour type'
        case 'P102_has_title': return 'a pour titre'
      }
      break
    case RDF_PREFIXES.get(RDF_BASE):
      switch (pu.localPart) {
        case 'type': return 'a pour classe'
      }
  }

  return ''
}