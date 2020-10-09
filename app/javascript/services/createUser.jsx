import apiService from "./api/apiService";

const createUser = async (fullname, email, organization_id, role_id) => {
  const response = await apiService
    .post("/registrations", {
      user: {
        fullname: fullname,
        email: email,
        organization_id: organization_id,
      },
      role_id: role_id,
    });
  return { success: response.status === 200 };
};

export default createUser;
