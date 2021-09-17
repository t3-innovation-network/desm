export const setStep = (step) => {
  return {
    type: "SET_STEP",
    payload: step,
  };
};

export const setCurrentConfigurationProfile = (configurationProfile) => {
  return {
    type: "SET_CURRENT_CP",
    payload: configurationProfile,
  };
};
