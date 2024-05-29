import { PiGlobeFill } from "react-icons/pi"

import { makeNegativeButton } from '../common/buttons'

type ResourceHeaderProps = {
    uri: string
}

export default function ResourceHeader({ uri }: ResourceHeaderProps) {
    return <header className="flex items-center">
        <h2
            className="text-link-negative"
            style={{ textShadow: 'aqua 0px 0px 15px' }}
        >
            {uri}
        </h2>
        {makeNegativeButton(<PiGlobeFill />, uri)}
    </header>
}