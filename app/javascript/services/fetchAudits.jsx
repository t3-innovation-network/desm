import apiRequest from "./api/apiRequest";

const fetchAudits = async (filters) => {
  /**
   * Build the string filter to pass to the HTTP GET operation
   *
   * @param {Object} filters
   */
  const buildFilter = (filters) => {
    let filterString =
      `?class_name=${filters.className}&audit_action=${filters.auditAction}&instance_ids=[${filters.instanceIds}]` +
      (filters.dateFrom ? "&date_from=" + filters.dateFrom : "");

    return filterString;
  };

  return await apiRequest({
    url: "/api/v1/audits" + buildFilter(filters),
    method: "get",
    successResponse: "audits",
  });
};

export default fetchAudits;
