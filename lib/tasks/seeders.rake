# frozen_string_literal: true

###
# @description: Here we have all the tasks that indirectly feeds the db
#   For some entities, we need to check files that are inside the project
#   in the form of skos/json-ld.
#
#   We check those files and seed the DB if we found that the entities inside
#   are not already in the application.
#
#   We have certainty of the existence of each of these entities by checking
#   the URI, which in the skos files is called "@id", and we map it to the uri
#   attribute of each entity.
###
namespace :seeders do
  desc "Import the domains from the skos file/s placed inside the 'ns' directory"
  task :fetch_domains do
    # @todo:
    #   - Check files inside 'ns' directory
    #   - for each |file|
    #   - check domain_set existence
    #   - call the parser
    #
    #   - parser to check each domain inside the file
  end
end
