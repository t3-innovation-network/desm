import apiService from "./apiService";

const fetchOrganization = (organization_id) => {
  return apiService
    .get("/api/v1/organizations/" + organization_id)
    .then((response) => {
      /// We have a list of organizations from the backend
      return {
        success: response.data.success,
        organization: response.data.organization,
      };
    });
};

export default fetchOrganization;
