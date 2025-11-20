import Link from '@/components/buttons-and-links/Link'
import { CRM_BASE, PrefixedUri, RDF_BASE, RDF_PREFIXES, RDFS_BASE, SKOS_BASE, IREMUS_NS_BASE, LRMOO_BASE } from 'sherlock-rdf/lib/rdf-prefixes'

export function makeClickablePrefixedUri(uri: string, pu: PrefixedUri, textSize: string = '') {
  return (
    <Link href={'/?resource=' + uri} className={textSize}>
      <span className='whitespace-nowrap'>
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
  textSize: string
) {
  return pu.prefix ? (
    <span className={'font-mono' + ' ' + textSize}>
      <span className='text-uri_prefix'>{pu.prefix}</span>
      <span className='text-uri_column'>:</span>
      <span className='text-uri_localpart'>{pu.localPart}</span>
    </span>
  ) : (
    <span className={textSize}>
      <span className='text-uri_localpart'>{pu.localPart}</span>
    </span>
  )
}

export function getReadableClass(pu: PrefixedUri): string {
  switch (pu.prefix) {
    case RDF_PREFIXES.get(CRM_BASE):
      switch (pu.localPart) {
        case 'E7_Activity': return 'Activité'
        case 'E21_Person': return 'Personne'
        case 'E35_Title': return 'Titre'
        case 'E41_Appellation': return 'Appellation'
        case 'E42_Identifier': return 'Identifiant'
        case 'E55_Type': return 'Type'
        case 'E65_Creation': return 'Événement de création'
        case 'E73_Information_Object': return 'Objet informationnel'
      }
      break
    case RDF_PREFIXES.get(LRMOO_BASE):
      switch (pu.localPart) {
        case 'F2_Expression': return 'Expression'
      }
      break
  }

  return ''
}

export function getReadablePredicate(pu: PrefixedUri): string {
  switch (pu.prefix) {
    case RDF_PREFIXES.get(CRM_BASE):
      switch (pu.localPart) {
        case 'P1_is_identified_by': return 'a pour identifiant'
        case 'P2_has_type': return 'a pour type'
        case 'P9_consists_of': return 'comprend'
        case 'P9i_forms_part_of': return 'fait partie de'
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
    case RDF_PREFIXES.get(LRMOO_BASE):
      switch (pu.localPart) {
        case 'R5_has_component': return 'a pour composant'
        case 'R5i_is_component_of': return 'est un composant de'
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
        case 'has_context_project': return 'a pour projet contexte'
        case 'has_member': return 'contient'
      }
  }

  return ''
}