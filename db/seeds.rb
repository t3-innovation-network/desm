# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# Fetch all seed files inside "fixtures" folder, as initial seeds
SeedFu.seed

# Let's create an admin user first
admin = User.create!(fullname: "admin",
  email: "admin@desmsolutions.org",
  password: ENV["DEFAULT_PASS"],
  organization: Organization.first,
  skip_sending_welcome_email: true
)

# Then 2 users for different organizations
user1 = User.create!(fullname: "user",
  email: "user1@desmsolutions.org",
  password: ENV["DEFAULT_PASS"],
  organization: Organization.first,
  skip_sending_welcome_email: true
)
user2 = User.create!(fullname: "user",
  email: "user2@desmsolutions.org",
  password: ENV["DEFAULT_PASS"],
  organization: Organization.find(2),
  skip_sending_welcome_email: true
)

# And an admin and a regular user role
admin_role_name = (ENV["ADMIN_ROLE_NAME"] || "Admin").downcase
admin_role = Role.create!(name: admin_role_name)
user_role = Role.create!(name: "Regular User")

# Assing "admin" role to our admin user
Assignment.create!(user: user1, role: user_role)
Assignment.create!(user: user2, role: user_role)
Assignment.create!(user: admin, role: admin_role)

# Fill the db with:
# - all the domains (also called abstract classes or concepts) and
# - all the predicates, which represents a way to identify the nature / quality of the mapping
#   between the spine term and mapped term.looking at files in the 'concepts' directory
["fetch_domains", "fetch_predicates"].each { |t| Rake::Task["seeders:#{t}"].invoke }
