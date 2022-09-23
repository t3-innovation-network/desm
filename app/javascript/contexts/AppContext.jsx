import React, { createContext, useState } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const [currentConfigurationProfileId, setCurrentConfigurationProfileId] = useState();
  const [leadMapper, setLeadMapper] = useState(false);
  const [loggedIn, setLoggedIn] = useState();
  const [organization, setOrganization] = useState();

  React.useEffect(() => {
    const { configurationProfileId, leadMapper, loggedIn, organization } = document.body.dataset;
    setCurrentConfigurationProfileId(configurationProfileId);
    setLeadMapper(leadMapper === "true");
    setLoggedIn(loggedIn === "true");
    organization && setOrganization(JSON.parse(organization));
  }, []);

  return (
    <AppContext.Provider value={{
      currentConfigurationProfileId,
      leadMapper,
      loggedIn,
      organization,
      setCurrentConfigurationProfileId,
      setLeadMapper,
      setLoggedIn,
      setOrganization
    }}>
      {children}
    </AppContext.Provider>
  );
};
