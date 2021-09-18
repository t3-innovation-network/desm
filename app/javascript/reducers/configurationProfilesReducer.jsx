export const configurationProfileStepReducer = (state = 1, action) => {
  switch (action.type) {
    case "SET_STEP":
      return action.payload;
    default:
      return state;
  }
};

export const currentConfigurationProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_CURRENT_CP":
      return action.payload;
    default:
      return state;
  }
};

export const savingConfigurationProfileReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_SAVING_CP":
      return action.payload;
    default:
      return state;
  }
};

export const EditCPErrorsReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_EDIT_CP_ERRORS":
      return action.payload;
    default:
      return state;
  }
};
