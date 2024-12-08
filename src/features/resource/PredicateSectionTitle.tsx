import { IoEnterOutline, IoExitOutline } from 'react-icons/io5'

import { PrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { makeYasguiButton } from '../../components/buttons'
import { makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { ReactNode } from 'react'

export default function ({
  direction,
  icon,
  title,
  prefixedUri,
  sparqlQuery,
  n
}: {
  direction: LinkedResourcesDirectionEnum | undefined
  icon: ReactNode
  title: string
  prefixedUri: PrefixedUri | undefined
  sparqlQuery: string
  n: number
}) {
  return (
    <div>
      <div className='section-divider' />
      <div className='px-6 py-2 section-font-predicate section-bg'>
        <h2 className='flex items-center'>
          {direction &&
            (direction === LinkedResourcesDirectionEnum.INCOMING ? (
              <span className='sectionTitleIcon'>
                <IoEnterOutline />
              </span>
            ) : (
              <span className='sectionTitleIcon'>
                <IoExitOutline />
              </span>
            ))}
          <span className='sectionTitleIcon'>{icon && icon}</span>
          {(icon || direction) && <span>&nbsp;</span>}
          <span className='text-prefixed_uri_local_name_darkbg text-prefixed_uri_prefix_darkbg text-prefixed_uri_prefix_darkbg font-mono'>
            {title}
          </span>
          {prefixedUri &&
            makeNonClickablePrefixedUri(prefixedUri, [
              'text-prefixed_uri_prefix_darkbg',
              'text-prefixed_uri_prefix_darkbg',
              'text-prefixed_uri_local_name_darkbg'
            ])}
          {n > 0 && (
            <span className='font-medium font-serif text-large text-stone-200 italic'>
              &nbsp;&nbsp;({n})
            </span>
          )}
          {sparqlQuery && (
            <div className='flex gap-[3px] ml-3'>
              {makeYasguiButton(
                sparqlQuery,
                'Ouvrir la requête SPARQL dans Yasgui'
              )}
            </div>
          )}
        </h2>
      </div>
      <div className='section-divider' />
    </div>
  )
}
