import React, { createContext, useState } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }) => {
  const [currentConfigurationProfile, setCurrentConfigurationProfile] = useState();
  const [hideLogo, setHideLogo] = useState(false);
  const [leadMapper, setLeadMapper] = useState(false);
  const [loggedIn, setLoggedIn] = useState();
  const [organization, setOrganization] = useState();


  React.useEffect(() => {
    const {
      configurationProfile,
      hideLogo,
      leadMapper,
      loggedIn,
      organization
    } = document.body.dataset;

    configurationProfile && setCurrentConfigurationProfile(JSON.parse(configurationProfile));
    setLeadMapper(leadMapper === "true");
    setLoggedIn(loggedIn === "true");
    organization && setOrganization(JSON.parse(organization));
    setHideLogo(hideLogo === "true");
  }, []);

  return (
    <AppContext.Provider value={{
      currentConfigurationProfile,
      hideLogo,
      leadMapper,
      loggedIn,
      organization,
      setCurrentConfigurationProfile,
      setHideLogo,
      setLeadMapper,
      setLoggedIn,
      setOrganization,

    }}>
      {children}
    </AppContext.Provider>
  );
};
