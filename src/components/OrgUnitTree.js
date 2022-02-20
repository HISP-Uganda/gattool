import { Stack, Text } from "@chakra-ui/react";
import { useDataEngine } from "@dhis2/app-runtime";
import { TreeSelect } from "antd";
import "antd/dist/antd.css";
import { useStore } from "effector-react";
import { flatten } from "lodash";
import { $store } from "../models/Store";
import { setUserOrgUnits, setSelectedOrgUnits, setCurrentUnit } from "../models/Events";

const createQuery = (parent) => {
  return {
    organisations: {
      resource: `organisationUnits.json`,
      params: {
        filter: `id:in:[${parent.id}]`,
        paging: "false",
        order: "shortName:desc",
        fields: "children[id,name,path,leaf]",
      },
    },
  };
};

const OrgUnitTree = () => {
  const store = useStore($store);
  const engine = useDataEngine();
  const onChange = (value) => {
    setSelectedOrgUnits(value)
    setCurrentUnit(value);
  }
  const loadOrganisationUnitsChildren = async (parent) => {
    try {
      const {
        organisations: { organisationUnits },
      } = await engine.query(createQuery(parent));
      const found = organisationUnits.map((unit) => {
        return unit.children
          .map((child) => {
            return {
              id: child.id,
              pId: parent.id,
              value: child.id,
              title: child.name,
              isLeaf: child.leaf,
            };
          })
          .sort((a, b) => {
            if (a.title > b.title) {
              return 1;
            }
            if (a.title < b.title) {
              return -1;
            }
            return 0;
          });
      });
      const all = flatten(found);
      setUserOrgUnits([...store.userOrgUnits, ...all]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Stack direction="row" flex={1} alignItems="center">
      <Text>Organisation:</Text>
      <TreeSelect
        allowClear={true}
        treeDataSimpleMode
        style={{
          border: 0,
          width: 400,
        }}
        value={store.currentUnit}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="Please select Organisation Unit(s)"
        onChange={onChange}
        loadData={loadOrganisationUnitsChildren}
        treeData={store.userOrgUnits}
      />
    </Stack>
  );
};

export default OrgUnitTree;
