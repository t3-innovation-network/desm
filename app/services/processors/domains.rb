# frozen_string_literal: true

module Processors
  ###
  # @description: This class will handle the tasks related to domains,
  #   which represents concepts.
  #
  #   E.g. "Person", "Organization", "Course"
  #
  #   One of the main tasks of this class will be to handle the existence
  #   of the domains by reading a skos file placed in a fixed directory in
  #   the project, called 'concepts'.
  ###
  class Domains < Skos
    include Validatable

    def initialize(file, domain_set: nil)
      @domain_set = domain_set
      @domains_ids = []
      super(file)
    end

    ###
    # @description: Process a given file which must contain json data, to
    #   create domains and domain sets into the db.
    ###
    def create
      @domain_set = create_or_update_domain_set
      create_or_update_domains

      @domain_set
    end

    ###
    # @description: Process a given file which must contain json data, to
    #   create/update domains and domain sets into/at the db.
    ###
    def update
      Domain.transaction do
        check_validity!
        create_or_update_domain_set
        create_or_update_domains
        clear_unused_domains
      end

      @domain_set
    end

    private

    ###
    # @description: Check if any previous predicates are in use and not in current set
    ###
    def check_validity!
      return if @domain_set.nil?

      ids = @domain_set.domains.ids
      @concept_nodes.each do |node|
        parser = Parsers::JsonLd::Node.new(node)
        next unless (domain = @domain_set.domains.find_by(source_uri: parser.read!("id"))).present?

        ids.delete(domain.id)
      end
      return if ids.blank?

      conflicts = @domain_set.domains.where(id: ids).includes(:spine).select(&:spine?)
      return if conflicts.blank?

      message = conflicts.map { |d| "#{d.pref_label} (#{d.source_uri})" }.join(", ")
      raise ArgumentError,
            I18n.t("errors.config.domain.destroy", count: conflicts.size, message:)
    end

    ###
    # @description: Remove domains that are not in current json file and doesn't have a spine
    ###
    def clear_unused_domains
      @domain_set.domains.where.not(id: @domains_ids).each(&:destroy)
    end

    ###
    # @description: Process a given concept scheme (domain set) to create it
    #   if necessary
    # @return [DomainSet]
    ###
    def create_or_update_domain_set
      ds = first_concept_scheme_node
      parser = Parsers::JsonLd::Node.new(ds)

      arttributes = {
        creator: parser.read!("creator"),
        description: parser.read!("description"),
        source_uri: parser.read!("id"),
        title: parser.read!("title") || parser.read!("label")
      }
      @domain_set.present? ? @domain_set.update!(arttributes) : DomainSet.create!(arttributes)
    end

    ###
    # @description: Process a given set of domains
    ###
    def create_or_update_domains
      @concept_nodes.each do |node|
        parser = Parsers::JsonLd::Node.new(node)

        domain = @domain_set.domains.find_or_initialize_by(source_uri: parser.read!("id"))
        domain.definition = parser.read!("definition")
        domain.pref_label = parser.read!("prefLabel")
        domain.save!
        @domains_ids << domain.id
      end
    end
  end
end
