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
import { useDataEngine } from "@dhis2/app-runtime";
import { useStore } from "effector-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { $store } from "../models/Store";
import { generateUid } from "../models/uid";

const ParticipantsSessions = ({ data, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sessionDates, setSessionDates] = useState(data.sessionDates);
  const [sessionDate, setSessionDate] = useState("");
  const [currentSession, setCurrentSession] = useState("");
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

  const findSession = (sessions, current) => {
    return !!sessions.find((s) => s.session === current);
  };

  const findCurrentSession = (sessions, current) => {
    const session = sessions.find((s) => s.session === current);

    if (session) {
      return session.event;
    }
    return "";
  };

  async function deleteEvent(event) {
    const mutation = {
      type: "delete",
      resource: "events",
      id: event,
    };
    await engine.mutate(mutation);
  }

  const { mutateAsync: deleteAsync } = useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["instance", id]);
    },
  });

  const addParticipantSession = async (
    participant,
    session,
    item,
    add,
    currentEvent = ""
  ) => {
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
    } else {
      if (currentEvent) {
        await deleteAsync(currentEvent);
      }
    }
  };
  return (
    <Stack direction="column">
      <Box textAlign="right" w="100%" bg="gray.100">
        <Button onClick={onOpen} colorScheme="teal" variant="ghost">
          <Text>+ Add Sessions</Text>
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
            <AccordionPanel w="100%" overflow="auto">
              <Accordion>
                {Object.entries(data.sessions).map(([s, optionSet]) => (
                  <AccordionItem key={s}>
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          {s}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Table colorScheme="cyan" size="md" flex={1}>
                        <Thead>
                          <Tr>
                            <Th>Individual Code</Th>
                            <Th>Individual Name</Th>
                            {optionSet.options.map((session) => (
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
                                <Td>{participant.vfHaBC1ONln}</Td>
                                {optionSet.options.map((session) => (
                                  <Td key={session.id}>
                                    <Checkbox
                                      isChecked={findSession(
                                        data.doneSessions,
                                        `${participant.ypDUCAS6juy}\\${session.code}\\${item}`
                                      )}
                                      onChange={(e) =>
                                        addParticipantSession(
                                          participant.ypDUCAS6juy,
                                          session.code,
                                          item,
                                          e.target.checked,
                                          findCurrentSession(
                                            data.doneSessions,
                                            `${participant.ypDUCAS6juy}\\${session.code}\\${item}`
                                          )
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
