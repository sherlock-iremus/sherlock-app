import { extendVariants, Button } from "@heroui/react";

export const MyButton = extendVariants(Button, {
    defaultVariants: {
        radius: 'none',
        variant: 'faded'
    }
})