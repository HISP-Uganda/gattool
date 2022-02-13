import {
  Button,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { format } from "date-fns";
import { useStore } from "effector-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import { setActive } from "../models/Events";
import { $store } from "../models/Store";
import { useTrackerSearch } from "../models/Queries";
const Participants = ({ data, id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState("");
  const store = useStore($store);
  const engine = useDataEngine();
  const queryClient = useQueryClient();
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

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    data: instances,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useTrackerSearch(query);

  const beneficiary = watch("ibKkBuv4gX1");

  const cancel = () => {
    setValue("ibKkBuv4gX1", "");
    onClose();
  };

  async function onSubmit(values) {
    try {
      const event = {
        event: store.active,
        trackedEntityInstance: id,
        dataValues: Object.entries(values).map(([dataElement, value]) => {
          return { dataElement, value };
        }),
        eventDate: format(new Date(), "yyyy-MM-dd"),
        programStage: "aTZwDRoJnxj",
        program: store.selectedProgram,
        orgUnit: store.selectedOrgUnits,
      };
      await mutateAsync(event);
      store.programStages["aTZwDRoJnxj"].forEach(({ id }) => setValue(id, ""));
    } catch (error) {
      console.log(error);
    }
  }
  const edit = (defaults) => {
    const { event, ...rest } = defaults;
    store.programStages["aTZwDRoJnxj"].forEach(({ id }) =>
      setValue(id, rest[id])
    );
    setActive(event);
  };
  useEffect(() => {
    if (beneficiary && beneficiary === "Comprehensive") {
      onOpen();
    }
  }, [beneficiary]);

  const selectRow = (row) => {
    setValue("ypDUCAS6juy", row["HLKc2AKR9jW"]);
    setValue("vfHaBC1ONln", row["huFucxA3e5c"]);
    setValue("ZUKC6mck81A", row["CfpoFtRmK1z"]);
    setValue("eXWM3v3oIKu", row["N1nMqKtYKvI"]);
    onClose();
  };
  return (
    <Stack>
      <Table colorScheme="cyan" size="sm">
        <Thead>
          <Tr>
            {store.programStages["aTZwDRoJnxj"]?.map((a) => (
              <Th key={a.id}>{a.name}</Th>
            ))}
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.participants.map((participant) => {
            return (
              <Tr key={participant.event}>
                {store.programStages["aTZwDRoJnxj"].map((a) => {
                  const record = a.compulsory
                    ? register(a.id, {
                        required: "This is required",
                      })
                    : register(a.id);
                  return (
                    <Td key={a.id}>
                      {participant.event === store.active ? (
                        <>
                          {a.optionSetValue ? (
                            <Select
                              size="sm"
                              placeholder="Select option"
                              id={a.id}
                              {...record}
                            >
                              {a.optionSet.options.map((option) => {
                                return (
                                  <option key={option.id} value={option.code}>
                                    {option.name}
                                  </option>
                                );
                              })}
                            </Select>
                          ) : (
                            <Input
                              size="sm"
                              id={a.id}
                              {...record}
                              type={a.valueType}
                            />
                          )}
                        </>
                      ) : (
                        participant[a.id]
                      )}
                    </Td>
                  );
                })}
                <Td>
                  {store.active === participant.event ? (
                    <Button
                      size="xs"
                      onClick={handleSubmit(onSubmit)}
                      isLoading={isSubmitting}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button size="xs" onClick={() => edit(participant)}>
                      Edit
                    </Button>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Comprehensive Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack>
              <FormControl>
                <FormLabel htmlFor="query">Search</FormLabel>
                <Input
                  id="query"
                  type="text"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </FormControl>

              <Table colorScheme="cyan" size="sm" variant="striped">
                <Thead>
                  <Tr>
                    <Th>Individual Code</Th>
                    <Th>Name</Th>
                    <Th>Organisation</Th>
                  </Tr>
                </Thead>
                {isLoading && (
                  <Tbody>
                    <Tr>
                      <Td colSpan={3}>
                        <Spinner />
                      </Td>
                    </Tr>
                  </Tbody>
                )}
                {isSuccess && (
                  <Tbody>
                    {instances.map((instance) => {
                      return (
                        <Tr
                          key={instance.instance}
                          cursor="pointer"
                          onClick={() => selectRow(instance)}
                        >
                          <Td>{instance.GWFyI8WPcI5}</Td>
                          <Td>{instance.huFucxA3e5c}</Td>
                          <Td>{instance.ouname}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                )}
                {isError && (
                  <Tbody>
                    <Tr>
                      <Td colSpan={3}>{error.message}</Td>
                    </Tr>
                  </Tbody>
                )}
              </Table>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={cancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
};

export default Participants;
