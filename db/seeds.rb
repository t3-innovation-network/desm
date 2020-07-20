# frozen_string_literal: true
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Initial Specifications
[
  {
    name: 'T3 Spine / CEDS (Default)',
    description: 'Stands for Common Education Data Standards'
  }
].each do |attrs|
  Specification.find_or_initialize_by(name: attrs[:name]).update!(attrs)
end

# Initial Domains
[
  { name: 'Person' },
  { name: 'Organization' },
  { name: 'Course' },
  { name: 'Credential' },
  { name: 'Employment' },
  { name: 'Competency' },
  { name: 'Prog. of Study' }
].each do |attrs|
  Domain.find_or_initialize_by(name: attrs[:name]).update!(attrs)
end
