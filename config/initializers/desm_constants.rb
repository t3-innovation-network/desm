module Desm
    APP_DOMAIN = ENV['APP_DOMAIN'] || 'http://localhost:3030'
    ADMIN_ROLE_NAME = ENV['ADMIN_ROLE_NAME'] || 'Super Admin'
    CONCEPTS_DIRECTORY_PATH = 'concepts/'
    DEFAULT_PASS = ENV['DEFAULT_PASS'] || 'xZ!2Hd!cYLzS^sc%P5'
    PRIVATE_KEY = ENV['PRIVATE_KEY'] || 'BAE4QavZnymiL^c584&nBV*dxEGFzas4KXiHTz!a26##!zsHnS'
    MIN_PASSWORD_LENGTH = ENV['MIN_PASSWORD_LENGTH'] || 8
end
