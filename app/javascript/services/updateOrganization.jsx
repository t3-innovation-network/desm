import apiService from "./apiService";

const updateOrganization = (organization_id, name) => {
  return apiService
    .put("/api/v1/organizations/" + organization_id, {
      organization: {
        name: name,
      },
    })
    .then((response) => {
      return { success: response.data.success };
    });
};

export default updateOrganization;
