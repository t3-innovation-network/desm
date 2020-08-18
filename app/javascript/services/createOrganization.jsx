import apiService from "./apiService";

const createOrganization = (name) => {
  return apiService
    .post("/api/v1/organizations", {
      organization: {
        name: name,
      },
    })
    .then((response) => {
      return { success: response.data.success };
    });
};

export default createOrganization;
