import { Table, Tbody, Td, Th, Thead, Tr, Checkbox } from "@chakra-ui/react";

const ParticipantsSessions = ({ data }) => {
  return (
    <Table colorScheme="cyan" size="sm">
      <Thead>
        <Tr>
          <Th>Participant</Th>
          {data.sessions.map((item) => (
            <Th key={item.id} minW="200px">
              {item.name}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.participants.map((participant) => (
          <Tr key={participant.event}>
            <Td>{participant.event}</Td>
            {data.sessions.map((item) => (
              <Td key={item.id}>
                <Checkbox />
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ParticipantsSessions;
