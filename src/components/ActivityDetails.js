import {
  Box,
  Flex,
  Heading,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
          ICYD Group Activity Tool
        </Heading>
      </Flex>
      {isLoading && <Spinner />}
      {isSuccess && (
        <Tabs>
          <TabList>
            <Tab>Participants</Tab>
            <Tab>Sessions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Participants data={data} id={id} />
            </TabPanel>
            <TabPanel>
              <ParticipantsSessions data={data} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
      {isError && <Box>{error.message}</Box>}
    </Stack>
  );
};

export default ActivityDetails;
