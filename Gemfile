# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) {|repo| "https://github.com/#{repo}.git" }

ruby "2.7.1"

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 6.0.3", ">= 6.0.3.2"

# Use postgresql as the database for Active Record
gem "pg", ">= 0.18", "< 2.0"

# Use Puma as the app server
gem "puma", "~> 4.1"

# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem "webpacker", "~> 4.0"

# Get react support on rails
gem "react-rails"

# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem "turbolinks", "~> 5"

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.7"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.2", require: false

# Use rubocop to ensure our code is clean
gem "rubocop", require: false

# Simplify seeding
gem "seed-fu"

# Authentication tools
gem "bcrypt", "~> 3.1", ">= 3.1.15"
gem "rack-cors", require: "rack/cors"

# Manage authorization
gem "pundit"

# For http requests
gem "httparty"

# Audit changes
gem "audited", "~> 4.9"

# Load env variables in dev & test modes
gem "dotenv-rails", "~> 2.7", groups: %i[development test]

gem "json_schema_tools", "~> 0.6"

gem "rubyzip", "~> 2.3", require: "zip"

# Use mailgun servers for sending mails
gem "mailgun_rails"

# Validate the use of strong passwords
gem "strong_password", "~> 0.0.8"

# Deal with sensitive data (encoding/decoding)
gem "jwt"

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: %i[mri mingw x64_mingw]
  gem "capybara"
  gem "factory_bot_rails"
  gem "faker"
  gem "rspec-rails", "~> 4.0.1"
  gem "shoulda-matchers"
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem "listen", "~> 3.2"
  gem "web-console", ">= 3.3.0"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"

  # Let's take advantage of rerun gem for hot-reload in development
  gem "rerun"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[mingw mswin x64_mingw jruby]
