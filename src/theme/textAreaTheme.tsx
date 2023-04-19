import { defineStyleConfig } from '@chakra-ui/react'

export const textareaTheme = defineStyleConfig({
    baseStyle: {
        color: 'purple.500', // change the input text color
        _dark: {
            color: 'purple.300',
            borderColor: 'purple.800',
            background: 'gray.800',
        },
    },
})