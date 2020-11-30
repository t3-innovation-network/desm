Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # This route will be starting point of the desm SPA
  root "homepage#index"

  resources :sessions, only: [:create]
  resources :registrations, only: [:create]
  delete :logout, to: 'sessions#logout'
  get :session_status, to: 'sessions#session_status'
  
  
  namespace :api do
    namespace :v1 do
      resources :audits, only: [:index]
      resources :domains, only: [:index, :show]
      resources :mappings, only: [:create, :show, :index, :update]
      resources :mapping_terms, only: [:index, :update]
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
      delete 'mappings/:id/selected_terms' => 'mapping_selected_terms#destroy'

      get 'mapping_terms/:id/vocabulary' => 'alignment_vocabularies#show'
      get 'mappings/:id/terms' => 'mappings#show_terms'
      post 'specifications/info' => 'specifications#info'
      post 'specifications/filter' => 'specifications#filter'
      post 'specifications/merge' => 'specifications#merge'
      get 'specifications/:id/terms' => 'terms#index'
      get 'vocabularies/:id/flat' => 'vocabularies#flat'
    end
  end

  resources :users, only: [:index, :show, :update, :destroy]

  # Redirect all missing routes to home
  get '/*path' => 'homepage#index'
end
