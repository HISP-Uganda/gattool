import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Text,
  Button,
  Flex,
  Table,
  TableCaption,
  Tr,
  Td,
  Thead,
  Tbody, Th, Tfoot, VStack
} from "@chakra-ui/react";
import Search16 from "@dhis2/ui-icons/build/cjs/react/Search16";

const GATApp = () => {
  return (
    <Box>
      <Box w='100%'>
        <Flex alignItems='center' justifyContent='center' w='100%' >
          <Box w='100%' h='50px' bg='gray.100' pl='15' verticalAlign='center'>
            <Heading as='h3' size='lg' color='blackAlpha.600'>ICYD Group Activity Tool</Heading>
          </Box>
        </Flex>
      </Box>
      <Box w='100%' h='95%' pt='2px'>
        <VStack>
          <HStack w='100%'>
          <InputGroup>
                  <Input placeholder='Type to search Group Activities' size='sm' ml='16px' />
                  <InputRightElement children={<Search16 color='green.500' />} />
          </InputGroup>
          <Button colorScheme='teal' variant='ghost'>
            Export to Excel
          </Button>
          <Button colorScheme='teal' variant='ghost'>
                  <Text>+ Add Group Activity</Text>
                </Button>
          </HStack>
          <Table variant='striped' colorScheme='gray' >
          <Thead>
            <Tr>
              <Th>Group Activity Name</Th>
              <Th>Description</Th>
              <Th >CSO/Partner</Th>
              <Th >Group</Th>
              <Th >Group Type</Th>
              <Th >Sub Group</Th>
              <Th>Date of Activity</Th>
              <Th isNumeric>Participants</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25</Td>
            </Tr>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25</Td>
            </Tr>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25</Td>
            </Tr>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25</Td>
            </Tr>
            
          </Tbody>
        </Table>
        </VStack>
      
      </Box>
    </Box>
  );
}

export default GATApp;  