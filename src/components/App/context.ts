import { createContext, useContext } from "react";

type AppContextApi = {

};

const AppContext = createContext<AppContextApi | null>(null);

export const AppContextProvider = AppContext.Provider;

export const useAppContext = () => useContext(AppContext);
