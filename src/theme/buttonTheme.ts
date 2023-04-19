import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const outline = defineStyle({

    _dark: {
        color: 'purple.300',
        borderColor: 'purple.800',
        background: 'gray.800',
    }
})

export const buttonTheme = defineStyleConfig({
    variants: { outline },
})