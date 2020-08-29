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
  desc "Import the domains from the skos file/s placed inside the 'concepts' directory"
  task fetch_domains: :environment do
    processed = 0
    p "== Seed for domains"
    p "Existent domain sets and domains will be ignored. Do you want to proceed? (y/n)"
    option = STDIN.gets.chomp

    if option == "y"
      # Get the concepts directory path from the environment variables
      path = File.join(Rails.root.to_s, "/", ENV.fetch("CONCEPTS_DIRECTORY_PATH"))

      Dir.foreach(path) do |filename|
        # Do not process the parent nor the current folder file representations
        next if (filename == ".") || (filename == "..")

        # Ensure we deal with a the file with classes
        next unless filename.downcase.include? "abstractclasses"

        p "Do you want to process #{filename}?"
        option = STDIN.gets.chomp

        if option == "y"
          file = File.read(path + "/" + filename)

          DomainsHelper.process_domains_from_file(file)

          processed += 1
        end
      end
    end

    p "#{ActionController::Base.helpers.pluralize(processed, 'file')} processed." +
      (processed < 1 ? " Be sure to name the files ending with 'abstractclasses'." : "")
  end

  desc "Import the predicates from the skos file/s placed inside the 'concepts' directory"
  task fetch_predicates: :environment do
    processed = 0
    p "== Seed for predicates"
    p "Existent predicates will be ignored. Do you want to proceed? (y/n)"
    option = STDIN.gets.chomp

    if option == "y"
      # Get the concepts directory path from the environment variables
      path = File.join(Rails.root.to_s, "/", ENV.fetch("CONCEPTS_DIRECTORY_PATH"))

      Dir.foreach(path) do |filename|
        # Do not process the parent nor the current folder file representations
        next if (filename == ".") || (filename == "..")

        # Ensure we deal with a the file with classes
        next unless filename.downcase.include? "predicates"

        p "Do you want to process #{filename}?"
        option = STDIN.gets.chomp

        if option == "y"
          file = File.read(path + "/" + filename)

          PredicatesHelper.process_from_file(file)

          processed += 1
        end
      end
    end

    p "#{ActionController::Base.helpers.pluralize(processed, 'file')} processed." +
      (processed < 1 ? " Be sure to name the files ending with 'abstractclasses'." : "")
  end
end
