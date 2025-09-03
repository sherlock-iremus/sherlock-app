import React from 'react'
import SherlockBar from '@/components/SherlockBar'
import YasguiButton from '@/components/YasguiButton'

export type DarkPartProps = {
    identityQuery: string,
    outgoingPredicatesCountQuery: string;
    queryE13WithLiteralP141?: string
    resourceUri: string;
}

const DarkPart: React.FC<DarkPartProps> = ({
    resourceUri,
    identityQuery,
    outgoingPredicatesCountQuery,
    queryE13WithLiteralP141

}) => <div className='font-mono'>
        <SherlockBar />
        <div className="bg-black px-12 py-18 text-center">
            <h2 className='mb-1 font-mono text-stone-300 text-xs lowercase'>
                URI de la ressource consultée :
            </h2>
            <div className=''>
                <h2
                    className='text-[aqua] text-link_negative'
                    style={{
                        textShadow: 'darkturquoise 0px 0px 5px, darkturquoise 0px 0px 20px, darkturquoise 0px 0px 40px, darkturquoise 0px 0px 60px'
                    }}
                >
                    {resourceUri}
                </h2>
            </div>
            <br />
            <div>
                <div className='mb-2 font-mono text-stone-300 text-xs lowercase'>
                    Requêtes SPARQL (ouverture dans Yasgui) :
                </div>
                <div className='flex flex-wrap gap-1'>
                    <YasguiButton className='grow' query={identityQuery}>
                        identité de la ressource
                    </YasguiButton>
                    <YasguiButton className='grow' query={outgoingPredicatesCountQuery}>
                        nombres de triplets sortants par prédicats
                    </YasguiButton>
                    {queryE13WithLiteralP141 && <YasguiButton className='grow' query={queryE13WithLiteralP141}>
                        annotations à valeurs litérales
                    </YasguiButton>}
                </div>
            </div>
        </div>
    </div>

export default DarkPart