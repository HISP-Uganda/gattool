import { Box } from "@chakra-ui/react";
import { useStore } from "effector-react";
import {
  Outlet,
  ReactLocation,
  Router
} from "react-location";
import ActivityDetails from "./components/ActivityDetails";
import GATApp from "./GATApp";
import { useLoader } from "./models/Queries";
import { $store } from "./models/Store";

const location = new ReactLocation();

const MyApp = () => {
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
              path: "/activity", children: [
                {
                  path: ":id", element: <ActivityDetails />, children: [
                    { path: "participants", element: <ActivityDetails /> },
                    { path: "sessions", element: <ActivityDetails /> }
                  ]
                }
              ]
            }
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
