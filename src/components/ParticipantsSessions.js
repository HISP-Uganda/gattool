import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useMutation, useQueryClient } from "react-query";
import { useStore } from "effector-react";
import { parseISO,format } from 'date-fns'
import { generateUid } from "../models/uid";
import { $store } from "../models/Store";

const ParticipantsSessions = ({ data, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sessionDates, setSessionDates] = useState(data.sessionDates);
  const [sessionDate, setSessionDate] = useState("");
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const store = useStore($store);

  const addEvent = async (data) => {
    const mutation = {
      type: "create",
      resource: "events",
      data,
    };
    return await engine.mutate(mutation);
  };

  const { mutateAsync } = useMutation(addEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["instance", id]);
    },
  });
  const addSession = () => {
    setSessionDates([sessionDate, ...sessionDates]);
    onClose();
  };
  const addParticipantSession = async (participant, session, item, add) => {
    if (add) {
      const event = {
        event: generateUid(),
        trackedEntityInstance: id,
        dataValues: [
          { dataElement: "n20LkH4ZBF8", value: session },
          { dataElement: "ypDUCAS6juy", value: participant },
          { dataElement: "RECl06RNilT", value: item },
        ],
        eventDate: item,
        programStage: "VzkQBBglj3O",
        program: store.selectedProgram,
        orgUnit: store.selectedOrgUnits,
      };
      await mutateAsync(event);
    }
  };
  return (
    <Stack direction="column">
      <Box textAlign="right" w="100%">
        <Button onClick={onOpen} colorScheme="teal" variant="ghost">
          <Text>Add Session</Text>
        </Button>
      </Box>
      <Accordion>
        {sessionDates.map((item) => (
          <AccordionItem key={item}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {item}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <Table colorScheme="cyan" size="md" flex={1}>
                <Thead>
                  <Tr>
                    <Th>Participant</Th>
                    {data.sessions.map((session) => (
                      <Th key={session.id} minW="200px">
                        {session.name}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {data.participants
                    .filter(({ eventDate }) => !!eventDate)
                    .map((participant) => (
                      <Tr key={participant.event}>
                        <Td>{participant.ypDUCAS6juy}</Td>
                        {data.sessions.map((session) => (
                          <Td key={session.id}>
                            <Checkbox
                              isChecked={
                                data.doneSessions.indexOf(
                                  `${participant.ypDUCAS6juy}${session.code}${item}`
                                ) !== -1
                              }
                              onChange={(e) =>
                                addParticipantSession(
                                  participant.ypDUCAS6juy,
                                  session.code,
                                  item,
                                  e.target.checked
                                )
                              }
                            />
                          </Td>
                        ))}
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Group Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor="date">Session Date</FormLabel>
              <Input
                id="date"
                type="date"
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Stack spacing="40px" direction="row">
              <Button colorScheme="blue" onClick={addSession}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default ParticipantsSessions;
