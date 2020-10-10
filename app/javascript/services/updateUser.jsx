import apiRequest from "./api/apiRequest";

const updateUser = async (
  user_id,
  email,
  fullname,
  organization_id,
  role_id
) => {
  return await apiRequest({
    url: "/users/" + user_id,
    method: "put",
    payload: {
      user: {
        fullname: fullname,
        email: email,
        organization_id: organization_id,
      },
      role_id: role_id,
    },
  });
};

export default updateUser;
