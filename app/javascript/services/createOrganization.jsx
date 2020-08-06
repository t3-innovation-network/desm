import axios from 'axios';

const createOrganization = (
  name
) => {
  const baseURL = process.env.API_URL;

  return axios
    .post(
      baseURL + "/api/v1/organizations",
      {
        organization: {
          name: name,
        },
      },
      /// Tells the API that's ok to get the cookie in our client
      { withCredentials: true }
    )
    .then((response) => {
      return { success: response.data.success }
    })
}

export default createOrganization;