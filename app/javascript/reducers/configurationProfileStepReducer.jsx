const configurationProfileStepReducer = (state = 1, action) => {
  switch (action.type) {
    case "SET_STEP":
      return action.payload;
    default:
      return state;
  }
};

export default configurationProfileStepReducer;
