Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # This route will be starting point of the desm SPA
  root "homepage#index"

  resources :sessions, only: [:create]
  resources :registrations, only: [:create]
  delete :logout, to: 'sessions#logout'
  get :session_status, to: 'sessions#session_status'
  post 'password/forgot', to: 'passwords#forgot'
  post 'password/reset', to: 'passwords#reset'
  post 'password/strength', to: 'passwords#strength'
  
  namespace :api do
    namespace :v1 do
      resources :audits, only: [:index]
      resources :domains, only: [:index, :show]
      resources :mappings, only: [:create, :destroy, :show, :index, :update]
      resources :mapping_terms, only: [:destroy, :index, :update]
      resources :organizations, only: [:index, :show, :create, :update, :destroy]
      resources :predicates, only: [:index]
      resources :roles, only: [:index]
      resources :specifications, only: [:create, :destroy, :show]
      resources :spine_terms, only: [:create]
      resources :terms, only: [:show, :update, :destroy]
      resources :vocabularies, only: [:index, :create, :show]
      resources :alignment_vocabulary_concepts, only: [:update]
      resources :alignment_synthetic_concepts, only: [:create]
      resources :spine_specifications, only: :index

      # Mapping selected terms
      post 'mappings/:id/selected_terms' => 'mapping_selected_terms#create'
      get 'mappings/:id/selected_terms' => 'mapping_selected_terms#show'
      get 'mappings/:id/export' => 'mappings#export'
      delete 'mappings/:id/selected_terms' => 'mapping_selected_terms#destroy'

      get 'mapping_terms/:id/vocabulary' => 'alignment_vocabularies#show'
      get 'mappings/:id/terms' => 'mappings#show_terms'
      post 'merged_files/:id/classes' => 'merged_files#classes'
      post 'merged_files/:id/filter' => 'merged_files#filter'
      post 'merged_files/create' => 'merged_files#create'
      get 'specifications/:id/terms' => 'terms#index'
      get 'vocabularies/:id/flat' => 'vocabularies#flat'
    end
  end

  resources :users, only: [:index, :show, :update, :destroy]

  # Redirect all missing routes to home
  get '/*path' => 'homepage#index'
end
