# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# Fetch all seed files inside "fixtures" folder, as initial seeds
SeedFu.seed

# Fill the db with:
# - all the domains (also called abstract classes or concepts) and
# - all the predicates, which represents a way to identify the nature / quality of the mapping
#   between the spine term and mapped term.looking at files in the 'concepts' directory
["fetch_domains", "fetch_predicates"].each { |t| Rake::Task["seeders:#{t}"].invoke }
