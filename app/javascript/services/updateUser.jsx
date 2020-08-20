import apiService from "./apiService";

const updateUser = (user_id, email, fullname, organization_id, role_id) => {
  return apiService
    .put("/users/" + user_id, {
      user: {
        fullname: fullname,
        email: email,
        organization_id: organization_id,
      },
      role_id: role_id,
    })
    .then((response) => {
      if (response.status === 200) {
        return {
          success: true,
        };
      }
    });
};

export default updateUser;
