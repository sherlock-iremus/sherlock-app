import LinkButton from "@/components/common/LinkButton"
import { makeH2 } from "@/components/layout/markupHelpers"
import { extractDataFromIdentityBindings, IdentityData } from "@/utils/bindingsHelpers"
import { guessMediaRepresentation } from "@/utils/resourceTypeAndMedia"
import { BsFiletypeXml } from "react-icons/bs"
import { PiGitBranchDuotone } from "react-icons/pi"
import { E55_BUSINESS_ID } from "sherlock-rdf/lib/rdf-prefixes"
import { SparqlQueryResultObject } from "sherlock-rdf/lib/sparql-result"

interface Props {
    resourceIdentityBindings: SparqlQueryResultObject | undefined
}

const X: React.FC<Props> = ({ resourceIdentityBindings }) => {
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
            <>
                <LinkButton content='URI du fichier TEI dans sa forge' href={mediaRepresentation.forgeFileUri} icon={<PiGitBranchDuotone />} />
                <LinkButton content='URI du fichier TEI' href={mediaRepresentation.fileUri} icon={<BsFiletypeXml />} />
            </>
        )}
        <div className='flex justify-center p-11 w-full text-center'>
            {mediaRepresentation.component}
        </div>
    </>
        : ''
}

export default X