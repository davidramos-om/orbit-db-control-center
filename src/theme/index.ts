// export default {
//     colors: {
//         transparent: 'transparent',
//         black: '#171923',
//         white: '#F7FAFC',
//     },    
// }

import { extendTheme } from '@chakra-ui/react'

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
    }
});

export default theme