import { IoEnterOutline, IoExitOutline } from 'react-icons/io5'

import { PiGlobeFill } from 'react-icons/pi'
import { PrefixedUri } from 'sherlock-rdf/lib/rdf-prefixes'
import { makeNegativeButton, makeYasguiButton } from '@/components/buttons'
import { getReadablePredicate, makeNonClickablePrefixedUri } from './TriplesDisplayHelpers'
import { LinkedResourcesDirectionEnum } from 'sherlock-sparql-queries/lib/identity'
import { ReactNode } from 'react'

export default function ({
  direction,
  icon,
  title,
  link,
  prefixedUri,
  sparqlQuery,
  n
}: {
  direction: LinkedResourcesDirectionEnum | null
  link: string | null,
  icon: ReactNode | null
  title: string
  prefixedUri: PrefixedUri | null
  sparqlQuery: string | null
  n: number | null
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
          {title && <span className='font-mono text-prefixed_uri_prefix_darkbg'>
            {title}
          </span>}
          {prefixedUri &&
            <>
              {getReadablePredicate(prefixedUri)}
              {title && '('}
              {makeNonClickablePrefixedUri(prefixedUri, [
                'text-prefixed_uri_prefix_darkbg',
                'text-prefixed_uri_prefix_darkbg',
                'text-prefixed_uri_local_name_darkbg'
              ])}
              {title && ')'}
            </>}
          {n && (
            <span className='font-medium text-stone-400'>
              &nbsp;[{n} items]
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
          {link && (
            <div className='flex gap-[3px] ml-3'>
              {makeNegativeButton(
                <PiGlobeFill className='text-lg' />,
                link,
                "Ouvrir le lien"
              )}
            </div>
          )}
        </h2>
      </div>
      <div className='section-divider' />
    </div>
  )
}
