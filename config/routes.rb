# frozen_string_literal: true

Rails.application.routes.draw do
  # Routes related to organizations, are under the 'admin' namespace
  namespace :admin do
    get "/" => "organizations#index"
    resources :organizations, only: %i[index new create edit update destroy]
    resources :users, only: %i[index new create edit update destroy]
  end

  get "mappings/index"

  # Use devise user model
  devise_for :users

  # We have a home page. It's pages/home.html.erb
  root to: "pages#home"

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
