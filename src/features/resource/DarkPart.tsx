import React from 'react'
import { makeYasguiButton } from '@/components/buttons'
import SherlockBar from '@/components/SherlockBar';

export type DarkPartProps = {
    resourceUri: string;
    outgoingPredicatesCountQuery: string;
    incomingPredicatesCountQuery?: string;
}

const DarkPart: React.FC<DarkPartProps> = ({
    resourceUri,
    outgoingPredicatesCountQuery,
    incomingPredicatesCountQuery

}) => <>
        <SherlockBar />
        <div className="bg-black p-6 text-white">
            <h2 className='font-mono text-stone-300 text-xs lowercase'>
                Ressource consultée :
            </h2>
            <div className='flex items-center'>
                <h2
                    className='text-link_negative'
                    style={{
                        textShadow:
                            'darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px'
                    }}
                >
                    {resourceUri}
                </h2>
                <div className='flex gap-[3px] ml-3'>
                    {makeYasguiButton(
                        outgoingPredicatesCountQuery,
                        'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets sortants par prédicats'
                    )}
                    {/* {makeYasguiButton(
                    countIncomingPredicatesSparqlQuery,
                    'Ouvrir la requête SPARQL dans Yasgui : nombres de triplets entrants par prédicats'
                )} */}
                </div>
            </div>
        </div>
    </>

export default DarkPart