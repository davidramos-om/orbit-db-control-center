import { Button, ButtonProps, Flex, useColorMode } from '@chakra-ui/react';
import { MoonIcon as BsMoonStarsFill, SunIcon as BsSun } from '@chakra-ui/icons';

export default function ColorModeToggle(props: ButtonProps) {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Button
            aria-label="Toggle Color Mode"
            onClick={toggleColorMode}
            _focus={{ boxShadow: 'none' }}
            w="fit-content"
            {...props}>
            {colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
        </Button>
    );
}