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
user = User.create!(fullname: "user", email: "user@t3converter.com", password: "t3user", organization: Organization.first);
admin = User.create!(fullname: "admin", email: "admin@t3converter.com", password: "t3admin", organization: Organization.first);

# And an admin and a regular user role
admin_role_name = (ENV['ADMIN_ROLE_NAME'] || 'Admin').downcase
admin_role = Role.create!(name: admin_role_name);
user_role = Role.create!(name: "Regular User");

# Assing "admin" role to our admin user
Assignment.create!(user: user, role: user_role);
Assignment.create!(user: admin, role: admin_role);

# Fill the db with all the domains (also called abstract classes or concepts) looking at
# files in the 'concepts' directory
Rake::Task['seeders:fetch_domains'].invoke
