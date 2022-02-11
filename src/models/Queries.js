import { useDataEngine } from "@dhis2/app-runtime";
import { fromPairs } from "lodash";
import { useQuery } from "react-query";
import {
  setSelectedOrgUnits,
  setUserOrgUnits,
  setProgramUnits,
  setProgramTrackedEntityAttributes, //OSX Added
} from "./Events";

export function useLoader(program) {
  const engine = useDataEngine();
  const query = {
    me: {
      resource: "me.json",
      params: {
        fields: "organisationUnits[id,name,leaf]",
      },
    },
    programUnits: {
      resource: `programs/${program}`,
      params: {
        fields: "organisationUnits[id],programTrackedEntityAttributes[trackedEntityAttribute[*,optionSet[*,options[*]]]]",
      },
    },
  };
  return useQuery("initial", async () => {
    const {
      me: { organisationUnits },
      programUnits: { organisationUnits: units, programTrackedEntityAttributes },
    } = await engine.query(query);
    const processedUnits = organisationUnits.map((unit) => {
      return {
        id: unit.id,
        pId: unit.pId || "",
        value: unit.id,
        title: unit.name,
        isLeaf: unit.leaf,
      };
    });
    setProgramUnits(units.map((o) => o.id));
    setUserOrgUnits(processedUnits);
    setSelectedOrgUnits(organisationUnits[0].id);
    setProgramTrackedEntityAttributes(programTrackedEntityAttributes); //OSX Added

    return true;
  });
}

export function useTracker(orgUnits, program) {
  const engine = useDataEngine();
  const query = {
    instances: {
      resource: "trackedEntityInstances/query.json",
      params: {
        ou: orgUnits,
        program,
        ouMode: "DESCENDANTS",
      },
    },
  };
  return useQuery(["instances", orgUnits, program], async () => {
    const {
      instances: { rows, headers },
    } = await engine.query(query);

    const allData = rows.map((row) => {
      return fromPairs(headers.map((r, i) => [r.name, row[i]]));
    });
    return allData;
  });
}
