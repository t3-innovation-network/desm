# frozen_string_literal: true

# Preview all emails at http://localhost:3000/rails/mailers/mapping
class MappingPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/mapping/updated
  def updated
    MappingMailer.with(mapping: Mapping.all.sample, user: User.all.sample).updated
  end
end
