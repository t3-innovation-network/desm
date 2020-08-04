import axios from "axios";

const deleteUser = (user_id) => {
  return axios
    .delete("http://localhost:3000/users/" + user_id, {
      withCredentials: true,
    })
    .then((response) => {
      /// We have a list of users from the backend
      if (response.data.status == "removed") {
        return { removed: true };
      }
    });
};

export default deleteUser;
