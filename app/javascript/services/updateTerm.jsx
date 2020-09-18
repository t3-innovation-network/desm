import apiService from "./apiService";

const updateTerm = async (term) => {
  const response = await apiService.put("/api/v1/terms/" + term.id, {
    term: {
      name: term.name,
      property_attributes: term.property,
    },
  });
  if (response.status === 200) {
    return {
      success: true,
    };
  }
  return { success: false };
};

export default updateTerm;
