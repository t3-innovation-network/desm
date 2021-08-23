# Example users, 1 super admin
admin = User.find_by_email "admin@desmsolutions.org"
user1 = User.find_by_email "mapper1@desmsolutions.org"
user2 = User.find_by_email "mapper2@desmsolutions.org"
mapper_role = Role.find_by_name "Mapper"
super_admin_role = Role.find_by_name (ENV["ADMIN_ROLE_NAME"] || "SuperAdmin").downcase

Assignment.seed(:user_id,
    { user: user1, role: mapper_role },
    { user: user2, role: mapper_role },
    { user: admin, role: super_admin_role }
)
