import { Box, Stack, Spinner } from "@chakra-ui/react";
import { useStore } from "effector-react";
import {
  Outlet,
  ReactLocation,
  Router,
  createHashHistory,
} from "react-location";
import { useDataEngine } from "@dhis2/app-runtime";

import { useQueryClient } from "react-query";
import ActivityDetails from "./components/ActivityDetails";
import GATApp from "./GATApp";
import { fetchInstance, useLoader } from "./models/Queries";
import { $store } from "./models/Store";

const hashHistory = createHashHistory();

const location = new ReactLocation({ history: hashHistory });

const MyApp = () => {
  const engine = useDataEngine();
  const queryClient = useQueryClient();
  const store = useStore($store);
  const { isLoading, isSuccess, isError, error } = useLoader(
    store.selectedProgram
  );
  return (
    <>
      {isLoading && (
        <Stack alignItems="center" justifyContent="center" h="100%">
          <Spinner />
        </Stack>
      )}
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
