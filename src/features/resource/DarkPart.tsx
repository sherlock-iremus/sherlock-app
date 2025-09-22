import React from 'react'
import SherlockBar from '@/components/SherlockBar'

export type DarkPartProps = {
    identityQuery: string,
    dotOnePropertiesQuery: string,
    outgoingPredicatesCountQuery: string;
    queryE13WithLiteralP141?: string
    resourceUri: string;
    queryObjectsOfLowFanOutgoingPredicatesData: string;
}

const DarkPart: React.FC<DarkPartProps> = ({ resourceUri }) => <div className='font-mono'>
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
    </div>
</div>

export default DarkPart