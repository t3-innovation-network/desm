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

  namespace :api do
    namespace :v1 do
      resources :alignments, only: [:destroy, :index, :update]
      resources :alignment_vocabulary_concepts, only: [:update]
      resources :alignment_synthetic_concepts, only: [:create]
      resources :audits, only: [:index]
      resources :configuration_profiles, only: [:create, :index, :destroy, :show, :update]
      resources :domains, only: [:index, :show]
      resources :mappings, only: [:create, :destroy, :show, :index, :update]
      resources :merged_files, only: [:create, :show]
      resources :organizations, only: [:index, :show, :create, :update, :destroy]
      resources :predicates, only: [:index]
      resources :roles, only: [:index]
      resources :specifications, only: [:create, :destroy, :show]
      resources :spine_terms, only: [:create]
      resources :terms, only: [:show, :update, :destroy]
      resources :spine_specifications, only: %i[index show]

      resources :vocabularies, only: [:index, :create, :show] do
        post :extract, on: :collection
      end

      # Mapping selected terms
      post 'mappings/:id/selected_terms' => 'mapping_selected_terms#create'
      get 'mappings/:id/selected_terms' => 'mapping_selected_terms#show'
      get 'mappings/:id/export' => 'mappings#export'
      delete 'mappings/:id/selected_terms' => 'mapping_selected_terms#destroy'

      get 'alignments/:id/vocabulary' => 'alignment_vocabularies#show'
      get 'mappings/:id/terms' => 'mappings#show_terms'
      post 'merged_files/:id/classes' => 'merged_files#classes'
      post 'merged_files/:id/filter' => 'merged_files#filter'
      get 'specifications/:id/terms' => 'terms#index'
      get 'vocabularies/:id/flat' => 'vocabularies#flat'
      post 'configuration_profiles/:id/action' => 'configuration_profile_actions#call_action'
      get 'configuration_profile_schema' => 'configuration_profile_schemas#show'
      post 'validate_configuration_profile' => 'validate_configuration_profile#validate'

      post 'skos/fetch' => 'skos#fetch'
      get 'skos/labels' => 'skos#labels'

      get 'spines/:id/terms' => 'spine_terms#index'
    end
  end

  namespace :resources do
    get 'mapping_export_profile' => 'mapping_export_profile#show'
    get 'abstract-classes/:slug' => 'abstract_classes#show'
    get 'abstract-class-sets' => 'abstract_class_sets#index'
    get 'abstract-class-sets/:slug' => 'abstract_class_sets#show'
    get 'configuration-profiles' => 'configuration_profiles#index'
    get 'configuration-profiles/:slug' => 'configuration_profiles#show'
    get 'abstract-classes/:slug' => 'domains#show'
    get 'organizations' => 'organizations#index'
    get 'organizations/:slug' => 'organizations#show'
    get 'predicates/:slug' => 'predicates#show'
    get 'predicate-sets/:slug' => 'predicate_sets#show'
    get 'predicate-sets' => 'predicate_sets#index'
    get 'terms/:slug' => 'terms#show'
    get 'specifications/' => 'specifications#index'
    get 'specifications/:slug' => 'specifications#show'
    get 'spines/' => 'spines#index'
    get 'spines/:slug' => 'spines#show'
  end

  resources :users, only: [:index, :show, :update, :destroy]

  # Redirect all missing routes to home
  get '/*path' => 'homepage#index'
end
