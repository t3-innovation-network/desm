# frozen_string_literal: true

###
# @description: Here we have all the tasks related to files.
#
#   These are not the specifications representation, these are the merged files we use on upload phase.
###
namespace :files do
  desc "Remove those files that are no longer needed."
  task :clean_unused, [:interactive] => :environment do |_task, args|
    args.with_defaults(interactive: false)

    files = MergedFile.needs_removal

    if args[:interactive]
      puts "We're about to remove #{files.count} files. Please confirm. (y/n)"
      opt = $stdin.gets.chomp
    end

    if opt&.downcase == "y" || !args[:interactive]
      files.each(&:destroy!)
      puts "#{files.count} files removed"
    end

    puts "Exiting..."
  end
end
