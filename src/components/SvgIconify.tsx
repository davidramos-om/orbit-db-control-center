import { Icon } from '@iconify/react';
import { Box, BoxProps, useColorMode, useToken } from '@chakra-ui/react'

interface Props extends BoxProps {
    icon: string;
    rotate?: number;
    width?: number;
    height?: number;
    color?: string;
}

//*  We can get the icon code from https://iconify.design/icon-sets/
//*  For example, one icon code for the "home" could be "mdi:home"
export default function SvgIconify({ icon, sx, rotate = 180, width = 24, height = 24, color, ...others }: Props) {

    const { colorMode } = useColorMode();
    const [ light, dark ] = useToken('colors', [ 'gray.600', 'gray.500' ]);

    return (
        <Box
            {...others}
        >
            <Icon
                icon={icon}
                rotate={rotate}
                width={width}
                height={height}
                color={color ? color : (colorMode === 'light' ? light : dark)}
            />
        </Box>
    );
}