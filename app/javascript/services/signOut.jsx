import apiService from "./apiService";

const signOut = () => {
  return apiService.delete("/logout").then((response) => {
    return {
      success: response.status == 200,
    };
  });
};

export default signOut;
