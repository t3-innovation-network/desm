# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

###
# RUBY & RAILS
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "= 6.1.6.1"
###

###
# AUTHENTICATION TOOLS
gem "bcrypt", "~> 3.1", ">= 3.1.15"
gem "rack-cors", require: "rack/cors"
###

###
# REST OF THE DEPENDENCIES

gem "active_model_serializers", "~> 0.10"
gem "airbrake"

# Audit changes
gem "audited", "~> 4.9"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.2", require: false

# For http requests
gem "httparty"

gem "interactor-rails", "~> 2.0"

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem "jbuilder", "~> 2.7"

gem "json_schema_tools", "~> 0.6"

gem "json-schema"

# Deal with sensitive data (encoding/decoding)
gem "jwt"

# Work with RDF data in various formats
gem "linkeddata", "~> 3.1"

# Use mailgun servers for sending mails
gem "mailgun_rails"

gem "net-smtp", require: false

# Allow redirections in URI.open
gem "open_uri_redirections", "~> 0.2"

# Use postgresql as the database for Active Record
gem "pg", ">= 0.18", "< 2.0"

# Use Puma as the app server
gem "puma", "~> 4.1"

# Manage authorization
gem "pundit"

# Centralize access to tasks
gem "rake"

# A Ruby client library for Redis
gem "redis"

gem "rubyzip", "~> 2.3", require: "zip"

# Simplify seeding
gem "seed-fu"

# Validate the use of strong passwords
gem "strong_password", "~> 0.0.8"

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem "turbolinks", "~> 5"

# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem "webpacker", "~> 5.x"

gem "mimemagic", github: "mimemagicrb/mimemagic", ref: "01f92d86d15d85cfd0f20dabd025dcbd36a8a60f"

group :development, :test do
  gem "annotate"
  gem "brakeman", require: false
  gem "bullet"
  gem "byebug", platforms: %i[mri mingw x64_mingw]
  gem "capybara"
  gem "database_cleaner"
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[mri mingw x64_mingw]
  # Load env variables in dev & test modes
  gem "dotenv-rails", "~> 2.7"
  gem "factory_bot_rails"
  gem "faker"
  gem "rspec-rails"
  # Use rubocop to ensure our code is clean
  gem "rubocop", "~> 1.60", require: false
  # Disable rubocop for specs for now, too many offenses
  # gem "rubocop-rspec", require: false
  gem "shoulda-matchers"
  gem "traceroute"
  gem "vcr", "~> 6.2"
  gem "webmock", "~> 3.23"
end

group :development do
  gem "htmlbeautifier"
  gem "rails-erd"
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem "listen", "~> 3.2"
  gem "overcommit"
  # Let's take advantage of rerun gem for hot-reload in development
  gem "rerun"
  gem "solargraph"
  gem "solargraph-rails"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
  gem "web-console", ">= 3.3.0"
end

group :test do
  gem "simplecov", require: false

  # profiling, check https://test-prof.evilmartians.io/
  gem "ruby-prof", ">= 0.17.0", require: false
  gem "stackprof", ">= 0.2.9", require: false
  gem "test-prof"
  gem "vernier", ">= 0.3.0", require: false
end
