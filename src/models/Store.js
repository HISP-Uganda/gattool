import { domain } from "./Domains";
import {
  changeTotal,
  setProgramUnits,
  setSelectedOrgUnits,
  setSelectedActivity,
  setUserOrgUnits,
  setProgramTrackedEntityAttributes, //OSX Added
} from "./Events";

export const $store = domain
  .createStore({
    selectedOrgUnits: "",
    userOrgUnits: [],
    selectedProgram: "IXxHJADVCkb",
    programUnits: [],
    programTrackedEntityAttributes: [], //OSX Added
    selectedActivity:"",
    total: 0,
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
  }).on(setSelectedActivity, (state, selectedActivity) => {
    return { ...state, selectedActivity };
  })
  .on(setProgramUnits, (state, programUnits) => {
    return { ...state, programUnits };
  }).on(setProgramTrackedEntityAttributes, (state, programTrackedEntityAttributes) => { //OSX Added
    return { ...state, programTrackedEntityAttributes };
  });
