import apiRequest from "./api/apiRequest";

const setCurrentConfigurationProfile = async (id) => (
  await apiRequest({
    url: `/api/v1/configuration_profiles/${id}/set_current`,
    method: "get",
    defaultResponse: {}
  })
);

export default setCurrentConfigurationProfile;
