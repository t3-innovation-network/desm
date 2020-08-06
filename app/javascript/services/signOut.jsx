import axios from 'axios';

const signOut = () => {
  return axios
    .delete("http://localhost:3000/logout", { withCredentials: true })
    .then((response) => {
      return {
        success: response.status == 200
      }
    })
}

export default signOut;