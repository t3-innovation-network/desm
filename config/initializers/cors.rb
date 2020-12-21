Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV["API_URL"] || "http://localhost:3000"
    resource "*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV["API_URL"]
    resource "*",
             credentials: true,
             headers: :any,
             methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
