import moment from "moment";

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

export const formatDateForInput = (dateString) => {
  return moment(dateString)
    .locale(navigator.language)
    .format(moment.HTML5_FMT.DATE);
};
