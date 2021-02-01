import apiRequest from "./api/apiRequest";

const fetchAlignments = async (mappingId) => {
  return await apiRequest({
    url: "/api/v1/mappings/" + mappingId + "/terms",
    method: "get",
    defaultResponse: [],
    successResponse: "alignments"
  });
};

export default fetchAlignments;
