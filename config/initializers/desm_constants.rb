module Desm
    API_URL = ENV['API_URL'] || 'http://localhost:3030'
    ADMIN_ROLE_NAME = ENV['ADMIN_ROLE_NAME'] ||  'Super Admin'
    CONCEPTS_DIRECTORY_PATH = 'concepts/'
    DEFAULT_PASS = ENV['DEFAULT_PASS'] || 'xZ!2Hd!cYLzS^sc%P5'
    JWT_SECRET = ENV['JWT_SECRET'] || 'BAE4QavZnymiL^c584&nBV*dxEGFzas4KXiHTz!a26##!zsHnS'
    JWT_ALGORITHM = ENV['JWT_SECRET'] || 'RS256'
    MIN_PASSWORD_LENGTH = ENV['MIN_PASSWORD_LENGTH'] || 8
end
