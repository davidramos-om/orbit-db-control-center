import { checkboxAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(checkboxAnatomy.keys);
const baseStyle = definePartsStyle({
    // define the part you're going to style
    label: {
        fontFamily: 'mono', // change the font family of the label
    },
    control: {
        padding: 3,
        borderRadius: 0,
        borderColor: 'gray.400', // change the border color of the control

        _dark: {
            color: 'purple.300',
            borderColor: 'purple.800',
            background: 'gray.800',
        },
    },
});
export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
