import apiRequest from './api/apiRequest';

const checkLoginStatus = async (props) => {
  return await apiRequest({
    url: '/session_status',
    method: 'get',
    successResponse: 'session',
  }).then((response) => {
    if (response.error) {
      return response;
    }
    /// If we have no session cookie and the api tells us that the user is authenticated,
    /// let's update that information
    if (!props.loggedIn && response.session.logged_in) {
      return {
        loggedIn: true,
        user: response.session.user,
      };
    }
    /// If we have a session cookie, but the api responds us telling that there's no user
    /// authenticated, or in any other case, let's update that information according too.
    return {
      loggedIn: false,
      user: {},
    };
  });
};

export default checkLoginStatus;
