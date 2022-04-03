import { domain } from "./Domains";
import {
  changeTotal,
  setProgramUnits,
  setSelectedOrgUnits,
  setSelectedActivity,
  setUserOrgUnits,
  setProgramTrackedEntityAttributes,
  setProgramStages,
  setActive,
  setCurrentUnit,
  changeTotalInstances,
} from "./Events";

export const $store = domain
  .createStore({
    selectedOrgUnits: "",
    userOrgUnits: [],
    currentUnit: "",
    selectedProgram: "IXxHJADVCkb",
    programUnits: [],
    programTrackedEntityAttributes: [],
    programStages: {},
    selectedActivity: "",
    total: 0,
    totalInstances: 0,
    active: "",
  })
  .on(setUserOrgUnits, (state, userOrgUnits) => {
    return { ...state, userOrgUnits };
  })
  .on(setSelectedOrgUnits, (state, selectedOrgUnits) => {
    return { ...state, selectedOrgUnits };
  })
  .on(changeTotal, (state, total) => {
    return { ...state, total };
  })
  .on(changeTotal, (state, selectedProgram) => {
    return { ...state, selectedProgram };
  })
  .on(changeTotalInstances, (state, totalInstances) => {
    return { ...state, totalInstances };
  })
  .on(setSelectedActivity, (state, selectedActivity) => {
    return { ...state, selectedActivity };
  })
  .on(setProgramUnits, (state, programUnits) => {
    return { ...state, programUnits };
  })
  .on(
    setProgramTrackedEntityAttributes,
    (state, programTrackedEntityAttributes) => {
      return { ...state, programTrackedEntityAttributes };
    }
  )
  .on(setCurrentUnit, (state, currentUnit) => {
    return { ...state, currentUnit };
  })
  .on(setProgramStages, (state, programStages) => {
    return { ...state, programStages };
  })
  .on(setActive, (state, active) => {
    return { ...state, active };
  });
