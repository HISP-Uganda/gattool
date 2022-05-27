import { useDataEngine } from "@dhis2/app-runtime";
import { fromPairs, uniq } from "lodash";
import { useQuery } from "react-query";
import { sessions } from "../models/utils";
import { generateUid } from "./uid";
import {
  setSelectedOrgUnits,
  setUserOrgUnits,
  setProgramUnits,
  setProgramTrackedEntityAttributes,
  setProgramStages,
  setActive,
  setCurrentUnit,
  changeTotalInstances, //OSX Added
} from "./Events";

export const createDataValue = (dataValues, event) => {
  const code = dataValues.find((dv) => dv.dataElement === "ypDUCAS6juy") || "";
  const session =
    dataValues.find((dv) => dv.dataElement === "n20LkH4ZBF8") || "";
  const date = dataValues.find((dv) => dv.dataElement === "RECl06RNilT") || "";
  return {
    event,
    session: `${code.value}\\${session.value}\\${date.value}`,
  };
};

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
        fields:
          "organisationUnits[id],programTrackedEntityAttributes[mandatory,trackedEntityAttribute[*,optionSet[optionSetValue,options[id,name,code]]]],programStages[id,programStageDataElements[compulsory,sortOrder,dataElement[id,name,valueType,optionSetValue,optionSet[options[id,code,name]]]]]",
      },
    },
  };
  return useQuery("initial", async () => {
    const {
      me: { organisationUnits },
      programUnits: {
        organisationUnits: units,
        programTrackedEntityAttributes,
        programStages,
      },
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
    const processed = programStages.map(({ id, programStageDataElements }) => {
      return [
        id,
        programStageDataElements.map(
          ({ compulsory, sortOrder, dataElement }) => {
            return { compulsory, sortOrder, ...dataElement };
          }
        ),
      ];
    });
    setProgramUnits(units.map((o) => o.id));
    setUserOrgUnits(processedUnits);
    setCurrentUnit(organisationUnits[0].id);
    setSelectedOrgUnits(organisationUnits[0].id);
    setProgramTrackedEntityAttributes(programTrackedEntityAttributes);
    setProgramStages(fromPairs(processed));
    return true;
  });
}

export function useTracker(orgUnits, program, page, pageSize, q) {
  const engine = useDataEngine();
  let params = {
    ou: orgUnits,
    program,
    ouMode: "DESCENDANTS",
    page,
    pageSize,
    totalPages: "true",
  };

  if (q) {
    params = {
      ...params,
      attribute: `cYDK0qZSri9:LIKE:${q}`,
    };
  }
  const query = {
    instances: {
      resource: "trackedEntityInstances/query.json",
      params,
    },
  };
  return useQuery(
    ["instances", orgUnits, program, page, pageSize, query],
    async () => {
      const {
        instances: {
          rows,
          headers,
          metaData: {
            pager: { total },
          },
        },
      } = await engine.query(query);
      changeTotalInstances(total);
      const allData = rows.map((row) => {
        return fromPairs(headers.map((r, i) => [r.name, row[i]]));
      });
      return allData;
    }
  );
}

export function useTrackerSearch(q) {
  const engine = useDataEngine();
  const query = {
    instances: {
      resource: "trackedEntityInstances/query.json",
      params: {
        program: "RDEklSXCD4C",
        ouMode: "ALL",
        attribute: `HLKc2AKR9jW:LIKE:${q}`,
      },
    },
  };
  return useQuery(["instances-search", q], async () => {
    if (q) {
      const {
        instances: { rows, headers },
      } = await engine.query(query);
      const allData = rows.map((row) => {
        return fromPairs(headers.map((r, i) => [r.name, row[i]]));
      });
      return allData;
    }
    return [];
  });
}

export const fetchInstance = async (id, engine) => {
  const query = {
    instance: {
      resource: `trackedEntityInstances/${id}.json`,
      params: {
        fields: "*",
        program: "IXxHJADVCkb",
      },
    },
  };
  let { instance } = await engine.query(query);
  setSelectedOrgUnits(instance.orgUnit);
  const [enrollment] = instance.enrollments;
  let data = {
    participants: [],
    trackedEntityInstance: instance.trackedEntityInstance,
    sessions: [],
    attributes: fromPairs(
      instance.attributes.map((a) => {
        return [a.attribute, a.value];
      })
    ),
  };
  const participants = enrollment.events
    .filter((e) => e.programStage === "aTZwDRoJnxj" && e.deleted == false)
    .map(({ dataValues, event, eventDate }) => {
      return {
        event,
        eventDate,
        ...fromPairs(dataValues.map((dv) => [dv.dataElement, dv.value])),
      };
    });
  const doneSessions = enrollment.events
    .filter((e) => e.programStage === "VzkQBBglj3O" && e.deleted == false)
    .map(({ dataValues, event }) => {
      return createDataValue(dataValues, event);
    });
  const sessionDates = uniq(
    enrollment.events
      .filter((e) => e.programStage === "VzkQBBglj3O" && e.deleted == false)
      .map(({ dataValues }) => {
        return (
          dataValues.find((dv) => dv.dataElement === "RECl06RNilT")?.value || ""
        );
      })
  );
  const event = generateUid();
  setActive(event);
  data = {
    ...data,
    doneSessions,
    participants: [...participants, { event }],
    sessionDates,
  };
  const subGroup = instance.attributes.find(
    (a) => a.attribute === "mWyp85xIzXR"
  );

  if (subGroup) {
    const allGroups = String(subGroup.value).split(",");
    const queries = allGroups.map((g) => {
      if (sessions[g]) {
        return [
          g,
          {
            resource: `optionGroups/${sessions[g]}.json`,
            params: {
              fields: "options[id,name,code]",
            },
          },
        ];
      }
      return [];
    });

    const availableSessions = await engine.query(fromPairs(queries));
    data = { ...data, sessions: availableSessions };
  }
  return data;
};

export function useInstance(instance) {
  const engine = useDataEngine();
  return useQuery(["instance", instance], async () => {
    return fetchInstance(instance, engine);
  });
}

export async function deleteInstance(instance) {
  const engine = useDataEngine();
  const mutation = {
    type: "delete",
    resource: "trackedEntityInstances",
    id: instance,
  };
  await engine.mutate(mutation);
}
