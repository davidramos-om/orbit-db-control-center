import { useState } from "react";
import { Button, Input, Stack } from "@chakra-ui/react";

type IncrementerProps = {
    onIncrement: (value: number) => void
}

export default function IncrementerController({ onIncrement }: IncrementerProps) {

    const [ value, setValue ] = useState(1);

    return (
        <Stack
            direction={{ base: 'column', md: 'row' }}
        >
            <Input
                variant={"outline"}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
            />
            <Button
                variant={"outline"}
                colorScheme="blackAlpha"
                onClick={() => onIncrement(value)}
            >
                Increment
            </Button>

        </Stack>
    )
}