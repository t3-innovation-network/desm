import axios from 'axios';

const checkLoginStatus = (props) => {
  return axios
    .get("http://localhost:3000/session_status", { withCredentials: true })
    .then((response) => {
      /// If we have no session cookie and the api tells us that the user is authenticated,
      /// let's update that information
      if (response.status == 200 & !props.loggedIn) {
        return {
          loggedIn: true,
          user: response.data,
        }
        /// If we have a session cookie, but the api responds us telling that there's no user
        /// authenticated, let's update that information according too
      } else if (!response.status == 200 & props.loggedIn) {
        return {
          loggedIn: false,
          user: {},
        }
      }
    });
}

export default checkLoginStatus;