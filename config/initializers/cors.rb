Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins Desm::API_URL.split(',').map { |origin| origin.strip }
    resource "*",
             credentials: true,
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
