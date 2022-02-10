import { Box } from "@chakra-ui/react";
import { useStore } from "effector-react";
import {
  Link,
  MakeGenerics,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "react-location";
import GATApp from "./GATApp";
import ActivityForm from "./components/ActivityForm";
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
          routes={[{ path: "/", element: <GATApp /> }]}
        >
          <Outlet />
        </Router>
      )}
      {isError && <Box>{error.message}</Box>}
    </>
  );
};

export default MyApp;
