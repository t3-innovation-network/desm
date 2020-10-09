import apiService from "./api/apiService";

const updateUser = async (user_id, email, fullname, organization_id, role_id) => {
  const response = await apiService
    .put("/users/" + user_id, {
      user: {
        fullname: fullname,
        email: email,
        organization_id: organization_id,
      },
      role_id: role_id,
    });
  if (response.status === 200) {
    return {
      success: true,
    };
  }
};

export default updateUser;
