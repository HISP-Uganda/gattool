import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import App from "./App";

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
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default AppWrapper;
