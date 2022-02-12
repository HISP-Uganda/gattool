import { Box } from "@chakra-ui/react";
import { useStore } from "effector-react";
import { Outlet, ReactLocation, Router } from "react-location";
import { useDataEngine } from "@dhis2/app-runtime";

import { useQueryClient } from "react-query";
import ActivityDetails from "./components/ActivityDetails";
import GATApp from "./GATApp";
import { fetchInstance, useLoader } from "./models/Queries";
import { $store } from "./models/Store";

const location = new ReactLocation();

const MyApp = () => {
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error } = useLoader(
    store.selectedProgram
  );
  return (
    <>
      {isLoading && <Box>Loading ...</Box>}
      {isSuccess && (
        <Router
          location={location}
          routes={[
            { path: "/", element: <GATApp /> },
            {
              path: "/activity",
              children: [
                {
                  path: ":id",
                  element: <ActivityDetails />,
                  loader: ({ params: { id } }) =>
                    queryClient.getQueryData(["instance", id]) ??
                    queryClient.fetchQuery(["instance", id], () =>
                      fetchInstance(id, engine)
                    ),
                },
              ],
            },
          ]}
        >
          <Outlet />
        </Router>
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default MyApp;
