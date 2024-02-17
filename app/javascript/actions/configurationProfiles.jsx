export const setStep = (step) => {
  return {
    type: 'SET_STEP',
    payload: step,
  };
};

export const setCurrentConfigurationProfile = (configurationProfile) => {
  return {
    type: 'SET_CURRENT_CP',
    payload: configurationProfile,
  };
};

export const setCurrentDSOIndex = (index) => {
  return {
    type: 'SET_CURRENT_DSO_INDEX',
    payload: index,
  };
};

export const setSavingCP = (value) => {
  return { type: 'SET_SAVING_CP', payload: value };
};

export const setEditCPErrors = (value) => {
  return { type: 'SET_EDIT_CP_ERRORS', payload: value };
};
