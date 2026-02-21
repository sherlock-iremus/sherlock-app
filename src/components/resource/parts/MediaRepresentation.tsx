// import LinkButton from "@/components/common/LinkButton"
import LinkButton from "@/components/common/LinkButton"
import { makeH2 } from "@/components/layout/markupHelpers"
import { extractDataFromIdentityBindings, IdentityData } from "@/utils/bindingsHelpers"
import { guessMediaRepresentation } from "@/utils/resourceTypeAndMedia"
import { Tooltip } from "@heroui/react"
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

    // TODO
    return mediaRepresentation != undefined ? <>
        {makeH2(
            mediaRepresentation.title,
            mediaRepresentation.icon,
            '',
            <>
                <Tooltip>
                    <Tooltip.Trigger>
                        <LinkButton link={mediaRepresentation.forgeFileUri} Icon={PiGitBranchDuotone} />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        'URI du fichier TEI dans sa forge'
                    </Tooltip.Content>
                </Tooltip>
                <Tooltip>
                    <Tooltip.Trigger>
                        <LinkButton link={mediaRepresentation.fileUri} Icon={BsFiletypeXml} />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        'URI du fichier TEI'
                    </Tooltip.Content>
                </Tooltip>
            </>
        )}
        <div className='flex justify-center p-11 w-full text-center'>
            {mediaRepresentation.component}
        </div>
    </>
        : ''
}

export default X