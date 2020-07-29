Rails.application.routes.draw do
  # This route will be starting point of the desm SPA
  root "homepage#index"

  # Redirect all missing routes to home
  get '/*path' => 'homepage#index'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
