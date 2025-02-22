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

  desc "One-off task: set mapped_at for all mappings based on audits"
  task set_mapped_at_for_mappings: :environment do
    data = Audited::Audit.where(auditable_type: "Mapping", action: "update",
                                auditable_id: Mapping.mapped.ids).select do |a|
                                  a.audited_changes["status"] == [1, 2]
                                end
    # get the latest status change for each mapping
    data = data.group_by(&:auditable_id).transform_values do |audits|
      audits.max_by(&:created_at)
    end
    data.each_value do |audit|
      audit.auditable.update_column(:mapped_at, audit.created_at)
    end
    # if there are mapped mappings without audits set mapped at as last updated at
    Mapping.mapped.where(mapped_at: nil).each do |mapping|
      mapping.update_column(:mapped_at, mapping.updated_at)
    end
  end

  desc "One-off task: update predicates color"
  task update_predicates_color: :environment do
    Predicate.find_each do |predicate|
      predicate.assign_color
      predicate.save!
    end
  end

  desc "Update max_weight for existing predicate_sets"
  task update_predicate_sets: :environment do
    PredicateSet.find_each do |predicate_set|
      predicate_set.update_max_weight(nil)
    end
  end
end
