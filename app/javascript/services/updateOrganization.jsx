import apiService from "./api/apiService";

const updateOrganization = async (organization_id, name) => {
  const response = await apiService
    .put("/api/v1/organizations/" + organization_id, {
      organization: {
        name: name,
      },
    });
  return { success: response.data.success };
};

export default updateOrganization;
