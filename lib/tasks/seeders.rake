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
  task :fetch_domains, [:interactive] => :environment do |_task, args|
    args.with_defaults(interactive: false)

    processed = 0
    puts "\n\n== Seed for domains"

    if args[:interactive]
      puts "Existent domain sets and domains will be ignored. Do you want to proceed? (y/n)"
      option = $stdin.gets.chomp
    end

    if (option == "y") || (!args[:interactive])
      # Get the concepts directory path from the environment variables
      path = Rails.root.join(Desm::CONCEPTS_DIRECTORY_PATH)

      Dir.foreach(path.to_s) do |filename|
        # Do not process the parent nor the current folder file representations
        next if (filename == ".") || (filename == "..")

        # Ensure we deal with a the file with classes
        next unless filename.downcase.include? "abstractclasses"

        if args[:interactive]
          puts "Do you want to process #{filename}?"
          option = $stdin.gets.chomp
        end

        if (option == "y") || (!args[:interactive])
          # Read the file, then initialize the processor and create the domain set with its domains
          file = File.read(path.join(filename))
          processor = Processors::Domains.new(file)
          d_set = processor.create

          # Inform the user
          puts "\n#{ActionController::Base.helpers.pluralize(d_set.domains.count, 'domain')} processed." +
               (
                 d_set.domains.count < 1 ? " Be sure to correctly format the file as a json-ld skos concepts file." : ""
               )

          processed += 1
        end
      end
    end

    puts "\n#{ActionController::Base.helpers.pluralize(processed, 'file')} processed." +
         (processed < 1 ? " Be sure to name the files ending with 'abstractclasses'." : "")
  end

  desc "Import the predicates from the skos file/s placed inside the 'concepts' directory"
  task :fetch_predicates, [:interactive] => :environment do |_task, args|
    args.with_defaults(interactive: false)

    processed = 0
    puts "\n\n== Seed for predicates"

    if args[:interactive]
      puts "Existent predicates will be ignored. Do you want to proceed? (y/n)"
      option = $stdin.gets.chomp
    end

    if (option == "y") || (!args[:interactive])
      # Get the concepts directory path from the environment variables
      path = Rails.root.join(Desm::CONCEPTS_DIRECTORY_PATH)

      Dir.foreach(path) do |filename|
        # Do not process the parent nor the current folder file representations
        next if (filename == ".") || (filename == "..")

        # Ensure we deal with a the file with classes
        next unless filename.downcase.include? "predicates"

        if args[:interactive]
          puts "Do you want to process #{filename}?"
          option = $stdin.gets.chomp
        end

        if (option == "y") || (!args[:interactive])
          # Read the file, then initialize the processor and create the predicate set with its predicates
          file = File.read(path.join(filename))
          processor = Processors::Predicates.new(file)
          p_set = processor.create

          # Inform the user
          msg = " Be sure to correctly format the file as a json-ld skos concepts file." if p_set.predicates.count < 1
          puts "\n#{ActionController::Base.helpers.pluralize(p_set.predicates.count, 'predicate')} processed.#{msg}"

          processed += 1
        end
      end
    end

    puts "\n#{ActionController::Base.helpers.pluralize(processed, 'file')} processed." +
         (processed < 1 ? " Be sure to name the files ending with 'abstractclasses'." : "")
  end
end
