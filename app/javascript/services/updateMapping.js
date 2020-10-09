import apiService from "./api/apiService";

const updateMapping = async (mapping) => {
  const response = await apiService.put(
    "/api/v1/mappings/" + mapping.id,
    mapping
  );
  if (response.status === 200) {
    return {
      success: true,
    };
  }
  return { success: false };
};

export default updateMapping;
