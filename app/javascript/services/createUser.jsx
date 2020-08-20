import apiService from "./apiService";

const createUser = (fullname, email, organization_id, role_id) => {
  return apiService
    .post("/registrations", {
      user: {
        fullname: fullname,
        email: email,
        organization_id: organization_id,
      },
      role_id: role_id,
    })
    .then((response) => {
      return { success: response.status === 200 };
    });
};

export default createUser;
