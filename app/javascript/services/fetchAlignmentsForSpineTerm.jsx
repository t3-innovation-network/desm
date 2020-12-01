import { camelizeKeys } from "humps";
import apiRequest from "./api/apiRequest";

const fetchAlignmentsForSpineTerm = async (spineTermId) => {
  let response = await apiRequest({
    url: "/api/v1/mapping_terms?spine_term_id=" + spineTermId,
    method: "get",
    successResponse: "alignments",
    defaultResponse: [],
  });

  return camelizeKeys(response);
};

export default fetchAlignmentsForSpineTerm;
