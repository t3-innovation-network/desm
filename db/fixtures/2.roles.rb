# Create the roles (Valid roles)
admin_role_name = Desm::ADMIN_ROLE_NAME

Role.seed(:name,
    { name: admin_role_name },
    { name: "Mapper" },
    { name: "DSO Admin" },
    { name: "Profile Admin" }
)
