"use client";

import { createContext, useContext } from "react";

type DateRestrictionContextType = {
  allowPastRecord: boolean;
  setAllowPastRecord: (val: boolean) => void;
};

export const DateRestrictionContext = createContext<DateRestrictionContextType>({
  allowPastRecord: true,
  setAllowPastRecord: () => {},
});

export function useDateRestriction() {
  return useContext(DateRestrictionContext);
}