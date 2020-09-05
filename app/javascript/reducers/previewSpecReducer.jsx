/**
 * Represents the specification to preview
 *
 * @returns {Boolean}
 */
const previewSpecReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PREVIEW_SPECS":
      return action.payload;
    case "UNSET_PREVIEW_SPECS":
      return [];
    default:
      return state;
  }
};

export default previewSpecReducer;
