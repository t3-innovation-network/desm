Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins Desm::APP_DOMAIN.split(',').map { |origin| origin.strip }
    resource "*",
             credentials: true,
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
