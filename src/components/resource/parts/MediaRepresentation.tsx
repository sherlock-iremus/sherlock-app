import { makeH2 } from "@/components/layout/markupHelpers"
import { extractDataFromIdentityBindings, IdentityData } from "@/utils/bindingsHelpers"
import { guessMediaRepresentation } from "@/utils/resourceTypeAndMedia"
import { E55_BUSINESS_ID } from "sherlock-rdf/lib/rdf-prefixes"
import { SparqlQueryResultObject } from "sherlock-rdf/lib/sparql-result"

export default function ({ resourceIdentityBindings }: {
    resourceIdentityBindings: SparqlQueryResultObject | undefined
}) {
    const identityData: IdentityData = extractDataFromIdentityBindings(resourceIdentityBindings)

    // Project ID
    let projectId = null
    for (const b of identityData.identityBindings) {
        if (b.r_type_type?.value === E55_BUSINESS_ID) {
            projectId = b.label.value.split('/')[1]
        }
    }

    // Media representation
    const mediaRepresentation = guessMediaRepresentation(identityData, projectId)

    return mediaRepresentation != undefined ? <>
        {makeH2(
            mediaRepresentation.title,
            mediaRepresentation.icon,
            '',
            mediaRepresentation.links
        )}
        <div className='flex justify-center w-full text-center'>
            {mediaRepresentation.component}
        </div>
    </>
        : ''
}