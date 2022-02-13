import {
  Box,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useMatch } from "react-location";
import { useInstance } from "../models/Queries";
import Participants from "./Participants";
import ParticipantsSessions from "./ParticipantsSessions";
const ActivityDetails = () => {
  const {
    params: { id },
  } = useMatch();
  const { data, error, isError, isLoading, isSuccess } = useInstance(id);
  
  return (
    <Stack>
      <Flex
        alignItems="center"
        justifyContent="left"
        w="100%"
        pl={15}
        bg="gray.100"
      >
        <Heading as="h4" size="lg" color="blackAlpha.600">
          Group Activity: {data.attributes.dqbuxC5GB1M}
        </Heading>
      </Flex>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Stack>
          <Box bg="blue.100" p="20px">
            <HStack w='100%' spacing='24px' alignContent="center" alignItems="center">
                <Box w='20%'>NAME OF CSO/PARTNER: <Text as='mark'>{data.attributes.Ah4eyDOBf51}</Text> </Box>
                <Box w='20%'>GROUP/CLUB NAME/OTHER: <Text as='mark'>{data.attributes.cYDK0qZSri9}</Text></Box>
                <Box w='20%'>GROUP TYPE: <Text as='mark'>{data.attributes.bFnIjGJpf9t}</Text> </Box>
                <Box w='20%'>SUB GROUP: <Text as='mark'>{data.attributes.mWyp85xIzXR}</Text> </Box>
                <Box w='20%'>VENUE: <Text as='mark'>{data.attributes.D7wRx9mgwns}</Text> </Box>
            </HStack>
            <HStack spacing='24px' alignContent="center" alignItems="center" mt="10px">
                <Box w='25%'>ACTIVITY: <Text as='mark'>{data.attributes.dqbuxC5GB1M}</Text> </Box>
                <Box w='25%'>CODE: <Text as='mark'>{data.attributes.oqabsHE0ZUI}</Text></Box>
                <Box w='25%'>DATE OF ACTIVITY: <Text as='mark'>{data.attributes.b76aEJUPnLy}</Text> </Box>
                <Box w='25%'>ACTIVITY DESCRIPTION: <Text as='mark'>{data.attributes.Pll79WEVWHj}</Text></Box>
            </HStack>
          </Box>
          <Tabs mt='200px'>
            <TabList>
              <Tab>Manage Participants</Tab>
              <Tab>Manage Sessions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Participants data={data} id={id} />
              </TabPanel>
              <TabPanel>
                <ParticipantsSessions data={data} id={id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      )}
      {isError && <Box>{error.message}</Box>}
    </Stack>
  );
};

export default ActivityDetails;
