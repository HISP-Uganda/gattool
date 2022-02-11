import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useDataEngine } from "@dhis2/app-runtime";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { useStore } from "effector-react";
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
  "5. Stepping Stones": [],
  "6. Other (Specify)": [],
};
const ActivityForm = () => {
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    getValues,
  } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const store = useStore($store);

  const groupType = watch("bFnIjGJpf9t");

  const addTrackedEntityInstance = async (data) => {
    const mutation = {
      type: "create",
      resource: "trackedEntityInstances",
      data,
    };
    return await engine.mutate(mutation);
  };

  const { mutateAsync } = useMutation(addTrackedEntityInstance, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        "instances",
        store.selectedOrgUnits,
        store.selectedProgram,
      ]);
    },
  });

  async function onSubmit(values) {
    try {
      const data = {
        attributes: Object.entries(values).map(([attribute, value]) => {
          return { attribute, value };
        }),
        trackedEntityType: "jUBCsJonWQ2",
        orgUnit: store.selectedOrgUnits,
        enrollments: [
          {
            enrollmentDate: format(new Date(), "yyyy-MM-dd"),
            incident: format(new Date(), "yyyy-MM-dd"),
            program: store.selectedProgram,
            orgUnit: store.selectedOrgUnits,
          },
        ],
      };
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

  const getFiled = (field, record) => {
    if (field.id === "y1N7h8fdMNC") {
      if (groupType === "6. Other (Specify)") {
        <Input id={field.id} {...record} type={field.valueType} />;
      }
      return null;
    }
    return <Input id={field.id} {...record} type={field.valueType} />;
  };

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="teal"
        variant="ghost"
        isDisabled={store.programUnits.indexOf(store.selectedOrgUnits) === -1}
      >
        <Text>+ Add Group Activity</Text>
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
                    {ptea.trackedEntityAttribute.optionSetValue ? (
                      ptea.trackedEntityAttribute.id === "mWyp85xIzXR" ? (
                        <Select
                          placeholder="Select option"
                          id={ptea.trackedEntityAttribute.id}
                          {...record}
                        >
                          {getOptions().map((option) => {
                            return (
                              <option key={option.id} value={option.code}>
                                {option.name}
                              </option>
                            );
                          })}
                        </Select>
                      ) : (
                        <Select
                          placeholder="Select option"
                          id={ptea.trackedEntityAttribute.id}
                          {...record}
                        >
                          {ptea.trackedEntityAttribute.optionSet.options.map(
                            (option) => {
                              return (
                                <option key={option.id} value={option.code}>
                                  {option.name}
                                </option>
                              );
                            }
                          )}
                        </Select>
                      )
                    ) : (
                      <Input id={ptea.trackedEntityAttribute.id} {...record} type={ptea.trackedEntityAttribute.valueType} />
                    )}
                    <FormErrorMessage>
                      {errors.name && errors.name.message}
                    </FormErrorMessage>
                  </FormControl>
                );
              })}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                mt={4}
                isLoading={isSubmitting}
                type="submit"
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActivityForm;
