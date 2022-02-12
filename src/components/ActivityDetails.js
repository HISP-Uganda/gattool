import { Box, Stack, Heading, Flex } from "@chakra-ui/react";

const ActivityDetails = () => {
    return (
        <Stack>
            <Flex alignItems="center" justifyContent="left" w="100%" pl={15} bg="gray.100">
                <Heading as="h4" size="lg" color="blackAlpha.600">
                    ICYD Group Activity Tool
                </Heading>
            </Flex>
            <Stack>
                <Flex>
                    <Box w="20%" h=""> SSS</Box>
                    <Box w="80%" bg="yellow.200"> BB</Box>
                </Flex>
            </Stack>
        </Stack>
    )
}

export default ActivityDetails;