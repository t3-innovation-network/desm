import React, { createContext, useState } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const [currentConfigurationProfileId, setCurrentConfigurationProfileId] = useState();
  const [loggedIn, setLoggedIn] = useState();
  const [organization, setOrganization] = useState();

  React.useEffect(() => {
    const { configurationProfileId, loggedIn, organization } = document.body.dataset;
    setCurrentConfigurationProfileId(configurationProfileId);
    setLoggedIn(loggedIn === "true");
    organization && setOrganization(JSON.parse(organization));
  }, []);

  return (
    <AppContext.Provider value={{
      currentConfigurationProfileId,
      loggedIn,
      organization,
      setCurrentConfigurationProfileId,
      setLoggedIn,
      setOrganization
    }}>
      {children}
    </AppContext.Provider>
  );
};
