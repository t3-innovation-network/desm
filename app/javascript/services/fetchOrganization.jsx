import apiService from "./apiService";

const fetchOrganization = async (organization_id) => {
  const response = await apiService
    .get("/api/v1/organizations/" + organization_id);
  return {
    success: response.data.success,
    organization: response.data.organization,
  };
};

export default fetchOrganization;
