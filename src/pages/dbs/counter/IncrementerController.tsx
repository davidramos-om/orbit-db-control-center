import { useState } from "react";
import { Button, Input, Stack, Checkbox } from "@chakra-ui/react";

type IncrementerProps = {
    onIncrement: (value: number, pin: boolean) => void
}

export default function IncrementerController({ onIncrement }: IncrementerProps) {

    const [ value, setValue ] = useState(1);
    const [ pinData, setPinData ] = useState(false);

    return (
        <Stack
            direction={{ base: 'column', md: 'row' }}
        >
            <Input
                variant={"outline"}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
            />
            <Checkbox
                isChecked={pinData}
                width={{ base: '100%', md: 'auto' }}
                onChange={(e) => {
                    setPinData(e.target.checked);
                }}
            >
                Pin
            </Checkbox>
            <Button
                variant={"outline"}
                colorScheme="blackAlpha"
                onClick={() => onIncrement(value, pinData)}
            >
                Increment
            </Button>

        </Stack>
    )
}