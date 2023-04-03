import { ArrowBackIcon } from "@chakra-ui/icons";
import { Heading, HStack, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { PATH } from "#/routes";

export default function DbGoBack() {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(PATH.HOME);
    }

    return (
        <HStack>
            <IconButton
                aria-label="Go back"
                onClick={handleGoBack}
            >
                <ArrowBackIcon />
            </IconButton>
            <Heading
                size="md"
            >
                DATABASE
            </Heading>
        </HStack>
    );
}