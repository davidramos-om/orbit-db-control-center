import { Icon, Text } from "@chakra-ui/react";

export type SytemStatusIconProps = {
    color: string;
    label: string;
}

export function SytemStatusIcon({ color, label }: SytemStatusIconProps) {

    return (
        <>
            <Icon viewBox='0 0 200 200' color={color}>
                <path fill='currentColor' d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0' />
            </Icon>
            <Text> {label} </Text>
        </>
    );
}
