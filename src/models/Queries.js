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
  setCurrentUnit, //OSX Added
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
    setCurrentUnit(organisationUnits[0].id)
    setSelectedOrgUnits(organisationUnits[0].id);
    setProgramTrackedEntityAttributes(programTrackedEntityAttributes);
    setProgramStages(fromPairs(processed));
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
      instance.attributes.map((a) => [a.attribute, a.value])
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
      const code =
        dataValues.find((dv) => dv.dataElement === "ypDUCAS6juy") || "";
      const session =
        dataValues.find((dv) => dv.dataElement === "n20LkH4ZBF8") || "";
      const date =
        dataValues.find((dv) => dv.dataElement === "RECl06RNilT") || "";
      return { event, session: `${code.value}\\${session.value}\\${date.value}` };
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
  if (subGroup && sessions[subGroup.value]) {
    const optionQuery = {
      availableSessions: {
        resource: `optionGroups/${sessions[subGroup.value]}.json`,
        params: {
          fields: "options[id,name,code]",
        },
      },
    };
    const {
      availableSessions: { options },
    } = await engine.query(optionQuery);
    data = { ...data, sessions: options };
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
  await engine.mutate(mutation)
}