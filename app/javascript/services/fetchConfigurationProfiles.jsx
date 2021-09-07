import apiRequest from "./api/apiRequest";

const fetchConfigurationProfiles = async () => {
  return await apiRequest({
    url: "/api/v1/configuration_profiles",
    method: "get",
    defaultResponse: [],
    successResponse: "configurationProfiles",
  });
};

export default fetchConfigurationProfiles;
