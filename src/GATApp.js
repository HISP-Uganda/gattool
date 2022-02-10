import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Search16 from "@dhis2/ui-icons/build/cjs/react/Search16";
import { useStore } from "effector-react";
import { Link } from "react-location";
import ActivityForm from "./components/ActivityForm";
import OrgUnitTree from "./components/OrgUnitTree";
import { useTracker } from "./models/Queries";
import { $store } from "./models/Store";

const columns = [
  {
    name: "Ah4eyDOBf51",
    column: "Name of CSO/Partner",
    shortened: false,
  },
  {
    name: "cYDK0qZSri9",
    column: "Group/Club Name/Other",
    shortened: false,
  },
  {
    name: "bFnIjGJpf9t",
    column: "Group Type",
    shortened: false,
  },
  {
    name: "y1N7h8fdMNC",
    column: "Other Group Type",
    shortened: false,
  },
  {
    name: "D7wRx9mgwns",
    column: "Venue",
    shortened: false,
  },
  {
    name: "dqbuxC5GB1M",
    column: "Activity",
    shortened: false,
  },
  {
    name: "b76aEJUPnLy",
    column: "Date of Activity",
    shortened: false,
  },
  {
    name: "Pll79WEVWHj",
    column: "Description",
    shortened: true,
  },
  {
    name: "oqabsHE0ZUI",
    column: "Code",
    shortened: false,
  },
  {
    name: "mWyp85xIzXR",
    column: "Sub Group",
    shortened: false,
  },
];

const GATApp = () => {
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error, data } = useTracker(
    store.selectedOrgUnits,
    store.selectedProgram
  );

  return (
    <Stack>
      <Flex alignItems="center" justifyContent="center" w="100%">
        <Box w="100%" h="50px" bg="gray.100" pl="15" verticalAlign="center">
          <Heading as="h3" size="lg" color="blackAlpha.600">
            ICYD Group Activity Tool
          </Heading>
        </Box>
      </Flex>
      <Stack>
        <Stack direction="row" alignItems="center">
          <OrgUnitTree />
          <InputGroup w="30%">
            <Input placeholder="Type to search Group Activities" size="sm" />
            <InputRightElement children={<Search16 color="green.500" />} />
          </InputGroup>
          <Spacer />
          {/* <Button colorScheme="teal" variant="ghost">
            Export to Excel
          </Button> */}
          <ActivityForm />
        </Stack>
        <Box overflow="auto">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                {columns.map((item) => (
                  <Th key={item.name} minW="200px">
                    {item.column}
                  </Th>
                ))}
              </Tr>
            </Thead>
            {isLoading && (
              <Tbody>
                <Tr>
                  <Td colSpan={9}>
                    <Spinner />
                  </Td>
                </Tr>
              </Tbody>
            )}
            {isSuccess && (
              <Tbody>
                {data.map((d) => (
                  <Tr key={d.instance}>
                    {columns.map((item) => (
                      <Td key={`${d.instance}${item.name}`}>
                        <Text noOfLines={item.shortened ? 1 : 3}>
                          {d[item.name]}
                        </Text>
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            )}
            {isError && (
              <Tbody>
                <Tr>
                  <Td colSpan={9}>{error.message}</Td>
                </Tr>
              </Tbody>
            )}
          </Table>
        </Box>
      </Stack>
    </Stack>
  );
};

export default GATApp;
