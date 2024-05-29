import { Button, Link } from "@nextui-org/react"
import { ReactNode } from "react"

export function makeNegativeButton(icon: ReactNode, uri: string) {
    return <Button
        className="
        bg-black hover:bg-teal-950 
        border-1 border-teal-900 hover:border-cyan-300
        text-teal-500 hover:text-teal-300
        transition-all
        ml-3
        "
        isIconOnly
        radius='full'
        size="sm"
        href={uri} as={Link}
        isExternal
        startContent={icon}
    />
}

export function makePositiveButton(icon: ReactNode, uri: string) {
    return <Button
        className="
        bg-white hover:bg-teal-50
        border-1 border-teal-300 hover:border-cyan-300
        text-teal-500 hover:text-teal-500
        transition-all
        ml-3
        "
        isIconOnly
        radius='full'
        size="sm"
        href={uri} as={Link}
        isExternal
        startContent={icon}
    />
}

// bg-gradient-to-tr from-pink-500 to-yellow-500