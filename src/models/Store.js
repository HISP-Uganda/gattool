import { domain } from "./Domains";
import {
  changeTotal,
  setProgramUnits,
  setSelectedOrgUnits,
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
  })
  .on(setProgramUnits, (state, programUnits) => {
    return { ...state, programUnits };
  }).on(setProgramTrackedEntityAttributes, (state, programTrackedEntityAttributes) => { //OSX Added
    return { ...state, programTrackedEntityAttributes };
  });
