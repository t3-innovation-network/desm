# frozen_string_literal: true
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
user = User.create!(email: "user@t3converter.com", password: "t3user");
admin = User.create!(email: "admin@t3converter.com", password: "t3admin");

# And an admin and a regular user role
admin_role = Role.create!(name: "Admin");
user_role = Role.create!(name: "Regular User");

# Assing "admin" role to our admin user
Assignment.create(user: user, role: user_role);
Assignment.create(user: admin, role: admin_role);
