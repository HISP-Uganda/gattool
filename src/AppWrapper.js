import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import GATApp from './GATApp'
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const AppWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <GATApp />
        </ChakraProvider>
    </QueryClientProvider>
  );
};

export default AppWrapper;