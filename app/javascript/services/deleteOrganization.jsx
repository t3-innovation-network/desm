import axios from "axios";

const deleteOrganization = (organization_id) => {
  const baseURL = process.env.API_URL;

  return axios
    .delete(baseURL + "/api/v1/organizations/" + organization_id, {
      withCredentials: true,
    })
    .then((response) => {
      /// We have a successfull response from the backend
      return { success: response.data.status == "removed" };
    });
};

export default deleteOrganization;
