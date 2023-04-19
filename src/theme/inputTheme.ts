import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);


const baseStyle = definePartsStyle({
    // define the part you're going to style
    field: {
        fontFamily: 'mono', // change the font family
        color: 'purple.500', // change the input text color
        _dark: {
            color: 'purple.300',
            borderColor: 'purple.800',
            background: 'gray.800',
        },
    },
})

export const inputTheme = defineMultiStyleConfig({ baseStyle });
