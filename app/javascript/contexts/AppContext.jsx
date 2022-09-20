import React, { createContext, useState } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const [currentConfigurationProfileId, setCurrentConfigurationProfileId] = useState();
  const [loggedIn, setLoggedIn] = useState();

  React.useEffect(() => {
    const { configurationProfileId, loggedIn } = document.body.dataset;
    setCurrentConfigurationProfileId(configurationProfileId);
    setLoggedIn(loggedIn === "true");
  }, []);

  return (
    <AppContext.Provider value={{
      currentConfigurationProfileId,
      loggedIn,
      setCurrentConfigurationProfileId,
      setLoggedIn
    }}>
      {children}
    </AppContext.Provider>
  );
};
