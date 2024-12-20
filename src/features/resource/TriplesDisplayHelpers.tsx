import { Link } from 'react-router-dom'
import { PrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'

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