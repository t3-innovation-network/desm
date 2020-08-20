Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV["BASE_API_URL"] || "http://localhost:3000"
    resource "*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end

  allow do
    origins "https://desm.production.com"
    resource "*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end
end