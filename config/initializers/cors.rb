Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['CORS_ORIGINS'].split(',').map { |origin| origin.strip }
    resource "*",
             credentials: true,
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
