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
  const [sharedMappings, setSharedMappings] = useState(
    data.sharedMappings ? JSON.parse(data.sharedMappings) : []
  );

  return (
    <AppContext.Provider
      value={{
        currentConfigurationProfile,
        leadMapper,
        loggedIn,
        organization,
        sharedMappings,
        setCurrentConfigurationProfile,
        setLeadMapper,
        setLoggedIn,
        setOrganization,
        setSharedMappings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
