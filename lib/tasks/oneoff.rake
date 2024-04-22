# frozen_string_literal: true

namespace :oneoff do
  desc "One-off task: remove alignments with no corresponding term"
  task remove_inconsistent_alignments: :environment do
    # Remove alignments with no corresponding term
    term_ids = Term.ids
    Alignment.where("spine_term_id not in (?)", term_ids).destroy_all
  end

  desc "One-off task: sync organizations&users with configuration profile structure"
  task sync_organizations_users_with_cp: :environment do
    ConfigurationProfile.where(state: %i(active deactivated)).includes(:standards_organizations).each do |cp|
      # org attributes: :description, :email, :homepage_url, :name, :standards_page
      # agent attributes: :email, :fullname, :lead_mapper, phone, :github_handle,
      # associated_schemas: move as is
      structure = cp.structure.deep_dup.with_indifferent_access
      with_errors = false
      puts "Processing configuration Profile #{cp.id}, #{cp.name}"
      organizations = [].tap do |result|
        cp.standards_organizations.each do |org|
          unless org.valid?
            puts "Organization #{org.name} is invalid: #{org.errors.full_messages.join(', ')}"
            with_errors = true
          end
          org_data = structure[:standards_organizations].find { |dso| dso[:name] == org.name }

          data = { description: org.description, email: org.email, homepage_url: org.homepage_url, name: org.name,
                   standards_page: org.standards_page }
          data.merge!(associated_schemas: org_data&.fetch(:associated_schemas, []) || [])
          cp.configuration_profile_users.includes(:user).where(organization: org).each do |cpu|
            unless cpu.user.valid?
              puts "User #{cpu.user.email} is invalid: #{cpu.user.errors.full_messages.join(', ')}"
              with_errors = true
            end
            agent_data = { email: cpu.user.email, fullname: cpu.user.fullname, lead_mapper: cpu.lead_mapper,
                           phone: cpu.user.phone, github_handle: cpu.user.github_handle }
            data[:dso_agents] ||= []
            data[:dso_agents] << agent_data
          end
          result << data
        end
      end
      if with_errors
        puts "Configuration Profile #{cp.id}, #{cp.name} has errors, skipping"
        next
      end
      structure[:standards_organizations] = organizations
      cp.skip_update_organizations = true
      cp.update!(structure:)
      puts "Configuration Profile #{cp.id}, #{cp.name} updated"
    end
  end
end
