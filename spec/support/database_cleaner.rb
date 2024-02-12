# frozen_string_literal: true

RSpec.configure do |config|
  ###
  # This instructs RSpec to use database_cleaner to "truncate" the database before every test suite, it empties every
  # table entirely. This is a brute-force approach to database cleaning but for personal projects, it will serve just
  # fine.
  # Using Active Record, the except statement is essential. Without it, the database_cleaner will destroy Active
  # Record's environment data, resulting in a NoEnvironmentInSchemaError every time your tests run.
  ###
  config.before(:suite) do
    DatabaseCleaner.clean_with :truncation, except: %w(ar_internal_metadata)
  end

  ###
  # On a test-by-test basis (i.e. before(:each), not before(:suite)) , truncation is overkill.
  # Here, we set the database_cleaner strategy to transaction, which means every test will create a database
  # transaction that will simply be rolled back when it ends, as if it never happened.
  ###
  config.before do
    DatabaseCleaner.strategy = :transaction
  end

  ###
  # DatabaseCleaner.start and DatabaseCleaner.end are simply the triggers to start the cleaning process before and
  # after each test.
  ###
  config.before do
    DatabaseCleaner.start
  end

  config.after do
    DatabaseCleaner.clean
  end
end
