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
  useDisclosure,
} from "@chakra-ui/react";
import Search16 from "@dhis2/ui-icons/build/cjs/react/Search16";
import { useStore } from "effector-react";
import { useNavigate } from "react-location";
import ActivityForm from "./components/ActivityForm";
import OrgUnitTree from "./components/OrgUnitTree";
import { useTracker } from "./models/Queries";
import { $store } from "./models/Store";

const columns = [
  {
    name: "Ah4eyDOBf51",
    column: "Name of CSO/Partner",
    shortened: false,
    w: "100px",
  },
  {
    name: "cYDK0qZSri9",
    column: "Group/Club Name/Other",
    shortened: false,
    w: "100px",
  },
  {
    name: "bFnIjGJpf9t",
    column: "Group Type",
    shortened: false,
    w: "100px",
  },
  {
    name: "y1N7h8fdMNC",
    column: "Other Group Type",
    shortened: false,
    w: "100px",
  },
  {
    name: "D7wRx9mgwns",
    column: "Venue",
    shortened: false,
    w: "100px",
  },
  {
    name: "dqbuxC5GB1M",
    column: "Activity",
    shortened: false,
    w: "100px",
  },
  {
    name: "b76aEJUPnLy",
    column: "Date of Activity",
    shortened: false,
    w: "100px",
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
    w: "100px",
  },
  {
    name: "mWyp85xIzXR",
    column: "Sub Group",
    shortened: false,
  },
];

const GATApp = () => {
  const store = useStore($store);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading, isSuccess, isError, error, data } = useTracker(
    store.currentUnit,
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
          <ActivityForm onOpen={onOpen} onClose={onClose} isOpen={isOpen} defaultValues={{}} />
        </Stack>
        <Box overflow="auto">
          <Table variant="striped" colorScheme="gray" size="sm">
            <Thead>
              <Tr>
                {columns.map((item) => (
                  <Th key={item.name} minW="300px">
                    {item.column}
                  </Th>
                ))}
              </Tr>
            </Thead>
            {isLoading && (
              <Tbody>
                <Tr>
                  <Td colSpan={11} textAlign="center">
                    <Spinner />
                  </Td>
                </Tr>
              </Tbody>
            )}
            {isSuccess && (
              <Tbody>
                {data.map((d) => (
                  <Tr
                    key={d.instance}
                    cursor="pointer"
                    onClick={() => navigate({ to: `./activity/${d.instance}` })}
                  >
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
                  <Td colSpan={11}>{error.message}</Td>
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
