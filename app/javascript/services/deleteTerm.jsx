import apiService from "./api/apiService";

const deleteTerm = async (term_id) => {
  const response = await apiService.delete("/api/v1/terms/" + term_id);
  if (response.status == 200 && response.data.status == "removed") {
    return { removed: true };
  }
};

export default deleteTerm;
