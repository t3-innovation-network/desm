import apiService from "./api/apiService";

const createOrganization = async (name) => {
  const response = await apiService
    .post("/api/v1/organizations", {
      organization: {
        name: name,
      },
    });
  return { success: response.data.success };
};

export default createOrganization;
