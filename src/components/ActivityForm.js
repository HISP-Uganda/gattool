import React from "react";
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
import { useStore } from "effector-react";
import { $store } from "../models/Store";
const ActivityForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const store = useStore($store);
  

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

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Group Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {
              store.programTrackedEntityAttributes.map((ptea) => (
                
                <FormControl key={ptea.trackedEntityAttribute.id}>
                  <FormLabel htmlFor='email'>{ptea.trackedEntityAttribute.name}</FormLabel>
                  {
                    ptea.trackedEntityAttribute.optionSetValue? <Select placeholder='Select option' id={ptea.trackedEntityAttribute.optionSet.id}>
                    {
                      ptea.trackedEntityAttribute.optionSet.options.map((option) =>{
                        return <option value={option.code} key={option.id}>{option.name}</option>
                      })
                    }
                  </Select> : <Input id={ptea.trackedEntityAttribute.id} type={ptea.trackedEntityAttribute.valueType} />
                  }
                </FormControl>
              ))
            }
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActivityForm;
