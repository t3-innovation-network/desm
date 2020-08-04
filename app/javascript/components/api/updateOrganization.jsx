import axios from 'axios';

const updateOrganization = (
  organization_id,
  name
) => {
  return axios
  .put(
    "http://localhost:3000/api/v1/organizations/" + organization_id,
    {
      organization: {
        name: name
      },
    },
    /// Tells the API that's ok to get the cookie in our client
    { withCredentials: true }
  )
  .then((response) => {
    return { success: response.data.success }
  })
}

export default updateOrganization;