// app context

import { createContext } from "react";
export const HomeModeContext = createContext({
  homeMode: "clients",
  setHomeMode: () => {},
});
