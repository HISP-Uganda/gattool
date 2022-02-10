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
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}></ModalBody>
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
