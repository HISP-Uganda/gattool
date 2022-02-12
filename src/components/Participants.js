import {
  Button,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { format } from "date-fns";
import { useStore } from "effector-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import { setActive } from "../models/Events";
import { $store } from "../models/Store";
const Participants = ({ data, id }) => {
  const [defaultValues, setDefaultValues] = useState({});
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
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

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
  return (
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
  );
};

export default Participants;
