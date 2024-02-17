import React, { createContext, useState } from 'react';

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const [currentConfigurationProfile, setCurrentConfigurationProfile] = useState();
  const [leadMapper, setLeadMapper] = useState(false);
  const [loggedIn, setLoggedIn] = useState();
  const [organization, setOrganization] = useState();

  React.useEffect(() => {
    const { configurationProfile, leadMapper, loggedIn, organization } = document.body.dataset;
    configurationProfile && setCurrentConfigurationProfile(JSON.parse(configurationProfile));
    setLeadMapper(leadMapper === 'true');
    setLoggedIn(loggedIn === 'true');
    organization && setOrganization(JSON.parse(organization));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentConfigurationProfile,
        leadMapper,
        loggedIn,
        organization,
        setCurrentConfigurationProfile,
        setLeadMapper,
        setLoggedIn,
        setOrganization,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
