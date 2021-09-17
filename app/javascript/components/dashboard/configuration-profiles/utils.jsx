export const stateStyle = (state) => {
  return {
    color: stateColorsList[state],
  };
};

const stateColorsList = {
  active: "green",
  deactivated: "grey",
  incomplete: "red",
  complete: "orange",
};
