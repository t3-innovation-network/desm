import apiService from "./apiService";

const signOut = async () => {
  const response = await apiService.delete("/logout");
  return {
    success: response.status == 200,
  };
};

export default signOut;
