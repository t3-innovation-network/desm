import apiService from "./apiService";

const deleteOrganization = (organization_id) => {
  return apiService
    .delete("/api/v1/organizations/" + organization_id)
    .then((response) => {
      /// We have a successfull response from the backend
      return { success: response.data.status == "removed" };
    });
};

export default deleteOrganization;
