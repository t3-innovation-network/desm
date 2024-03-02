import { createContext, useState } from 'react';

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const data = document.body.dataset;
  const [currentConfigurationProfile, setCurrentConfigurationProfile] = useState(
    data.configurationProfile ? JSON.parse(data.configurationProfile) : null
  );
  const [leadMapper, setLeadMapper] = useState(data.leadMapper === 'true');
  const [loggedIn, setLoggedIn] = useState(data.loggedIn === 'true');
  const [organization, setOrganization] = useState(
    data.organization ? JSON.parse(data.organization) : null
  );

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
