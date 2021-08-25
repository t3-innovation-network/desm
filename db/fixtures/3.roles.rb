# Create the roles (Valid roles)
admin_role_name = (ENV["ADMIN_ROLE_NAME"] || "Super Admin")

Role.seed(:name,
    { name: admin_role_name },
    { name: "Mapper" },
    { name: "SDO Admin" },
    { name: "Profile Admin" }
)
