import apiService from "./api/apiService";

const deleteOrganization = async (organization_id) => {
  const response = await apiService
    .delete("/api/v1/organizations/" + organization_id);
  return { success: response.data.status == "removed" };
};

export default deleteOrganization;
