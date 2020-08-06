import axios from 'axios';

const signOut = () => {
  const baseURL = process.env.API_URL;

  return axios
    .delete(baseURL + "/logout", { withCredentials: true })
    .then((response) => {
      return {
        success: response.status == 200
      }
    })
}

export default signOut;