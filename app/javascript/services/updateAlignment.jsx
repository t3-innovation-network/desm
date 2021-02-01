import apiRequest from "./api/apiRequest";

const updateAlignment = async (data) => {
  return await apiRequest({
    url: "/api/v1/alignments/" + data.id,
    method: "put",
    payload: {
      alignment: data,
    },
  });
};

export default updateAlignment;
