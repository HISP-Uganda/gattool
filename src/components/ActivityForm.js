import {
  Button,
  FormControl,
  FormErrorMessage,
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
  Text,
} from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { format } from "date-fns";
import { useStore } from "effector-react";
import { Select } from "chakra-react-select";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { isEmpty } from "lodash";
import { $store } from "../models/Store";

const rules = {
  "1. VSLA Group": [
    {
      code: "VSLA Methodology",
      name: "VSLA Methodology",
      id: "csaOlWgrP0M",
    },
    {
      code: "VSLA TOT",
      name: "VSLA TOT",
      id: "zN3qcA45zFa",
    },
    {
      code: "Financial Literacy",
      name: "Financial Literacy",
      id: "w1LXBcjyGc8",
    },
    {
      code: "SPM Training",
      name: "SPM Training",
      id: "SbY75a4HQ91",
    },
    {
      code: "Bank Linkages",
      name: "Bank Linkages",
      id: "sUWKmNl1LWz",
    },
  ],
  "2. Sinovuyo": [
    {
      code: "SINOVUYO",
      name: "SINOVUYO",
      id: "SXa1484XcvG",
    },
    {
      code: "Financial Literacy",
      name: "Financial Literacy",
      id: "w1LXBcjyGc8",
    },
  ],
  "3. Journeys Plus": [
    {
      code: "MOE Journeys Plus",
      name: "MOE Journeys Plus",
      id: "qs3EKK4M8wY",
    },
    {
      code: "MOH Journeys curriculum",
      name: "MOH Journeys curriculum",
      id: "g0hJcS2L9GU",
    },
  ],
  "4. NMN": [
    {
      code: "No means No sessions (Boys)",
      name: "No means No sessions (Boys)",
      id: "wCyaM5Z93lZ",
    },
    {
      code: "No means No sessions (Girls)",
      name: "No means No sessions (Girls)",
      id: "QV3TyZXPWgv",
    },
  ],
  "7. Early Childhood Development (ECD)": [
    {
      code: "ECD",
      name: "GAT. Early Childhood Development",
      id: "QHaULS891IF",
    },
  ],
  "5. Stepping Stones": [],
  "6. Other (Specify)": [],
};
const ActivityForm = ({
  onOpen,
  onClose,
  isOpen,
  mode = "NEW",
  otherAttributes = {},
  defaultValues = {},
}) => {
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
  } = useForm({ defaultValues });
  watch("bFnIjGJpf9t");
  watch("mWyp85xIzXR");
  const store = useStore($store);
  const addTrackedEntityInstance = async (data) => {
    const mutation = {
      type: "create",
      resource: "trackedEntityInstances",
      data,
    };
    return await engine.mutate(mutation);
  };

  async function activityCode() {
    if (isEmpty(defaultValues)) {
      const parish = store.selectedOrgUnits;
      const {
        location: {
          parent: { code },
        },
      } = await engine.query({
        location: {
          resource: `organisationUnits/${parish}.json`,
          params: {
            fields: "parent[code]",
          },
        },
      });

      const {
        generatedCode: { value },
      } = await engine.query({
        generatedCode: {
          resource: `trackedEntityAttributes/oqabsHE0ZUI/generate.json`,
          params: {
            ORG_UNIT_CODE: code,
          },
        },
      });
      setValue("oqabsHE0ZUI", value);
    }
    onOpen();
  }

  const { mutateAsync } = useMutation(addTrackedEntityInstance, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        "instances",
        store.selectedOrgUnits,
        store.selectedProgram,
      ]);
      if (!isEmpty(otherAttributes)) {
        queryClient.invalidateQueries([
          "instance",
          otherAttributes.trackedEntityInstance,
        ]);
      }
    },
  });

  async function onSubmit(values) {
    try {
      let data = {
        attributes: Object.entries(values).map(([attribute, value]) => {
          return { attribute, value };
        }),
        trackedEntityType: "jUBCsJonWQ2",
        orgUnit: store.selectedOrgUnits,
      };

      if (isEmpty(otherAttributes)) {
        data = {
          ...data,
          enrollments: [
            {
              enrollmentDate: format(new Date(), "yyyy-MM-dd"),
              incident: format(new Date(), "yyyy-MM-dd"),
              program: store.selectedProgram,
              orgUnit: store.selectedOrgUnits,
            },
          ],
        };
      } else if (otherAttributes.trackedEntityInstance) {
        data = {
          ...data,
          trackedEntityInstance: otherAttributes.trackedEntityInstance,
        };
      }
      await mutateAsync(data);
      onClose();
    } catch (error) {
      console.log(error);
      onClose();
    }
  }

  const getOptions = () => {
    return rules[getValues("bFnIjGJpf9t")] || [];
  };

  return (
    <>
      <Button
        onClick={activityCode}
        colorScheme="teal"
        variant="ghost"
        isDisabled={store.programUnits.indexOf(store.selectedOrgUnits) === -1}
      >
        {mode === "NEW" ? <Text>+ Add Group Activity</Text> : <Text>Edit</Text>}
      </Button>

      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Group Activity</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={6}>
              <Stack>
                {store.programTrackedEntityAttributes.map((ptea) => {
                  const record = ptea.mandatory
                    ? register(ptea.trackedEntityAttribute.id, {
                        required: "This is required",
                      })
                    : register(ptea.trackedEntityAttribute.id);
                  return (
                    <FormControl
                      key={ptea.trackedEntityAttribute.id}
                      isRequired={ptea.mandatory}
                      isInvalid={errors[ptea.trackedEntityAttribute.id]}
                    >
                      <FormLabel htmlFor="email">
                        {ptea.trackedEntityAttribute.name}
                      </FormLabel>
                      {ptea.trackedEntityAttribute.id === "mWyp85xIzXR" ? (
                        <Select
                          isMulti
                          options={getOptions().map((o) => {
                            return {
                              value: o.code,
                              label: o.name,
                            };
                          })}
                          value={getOptions()
                            .map((o) => {
                              return {
                                value: o.code,
                                label: o.name,
                              };
                            })
                            .filter((option) => {
                              return (
                                String(
                                  getValues(ptea.trackedEntityAttribute.id)
                                )
                                  .split(",")
                                  .indexOf(option.value) !== -1
                              );
                            })}
                          onChange={(option) => {
                            setValue(
                              ptea.trackedEntityAttribute.id,
                              option.map((o) => o.value).join(",")
                            );
                          }}
                        />
                      ) : ptea.trackedEntityAttribute.optionSetValue ? (
                        <Select
                          options={ptea.trackedEntityAttribute.optionSet.options.map(
                            (o) => {
                              return {
                                value: o.code,
                                label: o.name,
                              };
                            }
                          )}
                          value={ptea.trackedEntityAttribute.optionSet.options
                            .map((o) => {
                              return {
                                value: o.code,
                                label: o.name,
                              };
                            })
                            .find((option) => {
                              return (
                                option.value ===
                                getValues(ptea.trackedEntityAttribute.id)
                              );
                            })}
                          onChange={(option) => {
                            setValue(
                              ptea.trackedEntityAttribute.id,
                              option.value
                            );
                          }}
                        />
                      ) : (
                        <Input
                          id={ptea.trackedEntityAttribute.id}
                          {...record}
                          type={ptea.trackedEntityAttribute.valueType}
                        />
                      )}
                      <FormErrorMessage>
                        {errors.name && errors.name.message}
                      </FormErrorMessage>
                    </FormControl>
                  );
                })}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Stack spacing="30px" direction="row">
                <Button
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </Stack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActivityForm;
