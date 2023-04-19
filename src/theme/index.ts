
import { extendTheme } from '@chakra-ui/react'
import { checkboxTheme } from "./checkboxTheme"
import { inputTheme } from "./inputTheme"
import { buttonTheme } from "./buttonTheme"
import { textareaTheme } from "./textAreaTheme"

const theme = extendTheme({
    config: {
        cssVarPrefix: 'obc',
    },
    colors: {
        transparent: 'transparent',
        black: '#171923',
        white: '#F7FAFC',
    },
    background: {
        'primary': '#171923',
        'secondary': '#F7FAFC',
    },
    components: {
        Checkbox: checkboxTheme,
        Input: inputTheme,
        Button: buttonTheme,
        Textarea: textareaTheme,
    },
});

export default theme