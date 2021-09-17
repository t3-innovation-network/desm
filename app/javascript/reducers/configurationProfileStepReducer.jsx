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
