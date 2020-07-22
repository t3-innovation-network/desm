# frozen_string_literal: true

Rails.application.routes.draw do
  # Routes related to companies, are under the 'admin' namespace
  namespace :admin do
    resources :companies
  end

  get "mappings/index"

  # Use devise user model
  devise_for :users

  # We have a home page. It's pages/home.html.erb
  root to: "pages#home"

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
