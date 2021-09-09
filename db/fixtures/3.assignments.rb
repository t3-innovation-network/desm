Assignment.seed do |a|
   a.user = User.find_by_email "admin@desmsolutions.org"
   a.role = Role.find_by_name Desm::ADMIN_ROLE_NAME.downcase
end
