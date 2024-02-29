# == Route Map
#
#                                   Prefix Verb   URI Pattern                                                                              Controller#Action
#                                     root GET    /                                                                                        homepage#index
#                                 sessions POST   /sessions(.:format)                                                                      sessions#create
#                            registrations POST   /registrations(.:format)                                                                 registrations#create
#                                   logout DELETE /logout(.:format)                                                                        sessions#logout
#                           session_status GET    /session_status(.:format)                                                                sessions#session_status
#                          password_forgot POST   /password/forgot(.:format)                                                               passwords#forgot
#                           password_reset POST   /password/reset(.:format)                                                                passwords#reset
#                        api_v1_alignments GET    /api/v1/alignments(.:format)                                                             api/v1/alignments#index
#                         api_v1_alignment PATCH  /api/v1/alignments/:id(.:format)                                                         api/v1/alignments#update
#                                          PUT    /api/v1/alignments/:id(.:format)                                                         api/v1/alignments#update
#                                          DELETE /api/v1/alignments/:id(.:format)                                                         api/v1/alignments#destroy
#      api_v1_alignment_vocabulary_concept PATCH  /api/v1/alignment_vocabulary_concepts/:id(.:format)                                      api/v1/alignment_vocabulary_concepts#update
#                                          PUT    /api/v1/alignment_vocabulary_concepts/:id(.:format)                                      api/v1/alignment_vocabulary_concepts#update
#      api_v1_alignment_synthetic_concepts POST   /api/v1/alignment_synthetic_concepts(.:format)                                           api/v1/alignment_synthetic_concepts#create
#                            api_v1_audits GET    /api/v1/audits(.:format)                                                                 api/v1/audits#index
#                           api_v1_domains GET    /api/v1/domains(.:format)                                                                api/v1/domains#index
#                            api_v1_domain GET    /api/v1/domains/:id(.:format)                                                            api/v1/domains#show
#                          api_v1_mappings GET    /api/v1/mappings(.:format)                                                               api/v1/mappings#index
#                                          POST   /api/v1/mappings(.:format)                                                               api/v1/mappings#create
#                           api_v1_mapping GET    /api/v1/mappings/:id(.:format)                                                           api/v1/mappings#show
#                                          PATCH  /api/v1/mappings/:id(.:format)                                                           api/v1/mappings#update
#                                          PUT    /api/v1/mappings/:id(.:format)                                                           api/v1/mappings#update
#                                          DELETE /api/v1/mappings/:id(.:format)                                                           api/v1/mappings#destroy
#                      api_v1_merged_files POST   /api/v1/merged_files(.:format)                                                           api/v1/merged_files#create
#                       api_v1_merged_file GET    /api/v1/merged_files/:id(.:format)                                                       api/v1/merged_files#show
#                     api_v1_organizations GET    /api/v1/organizations(.:format)                                                          api/v1/organizations#index
#                                          POST   /api/v1/organizations(.:format)                                                          api/v1/organizations#create
#                      api_v1_organization GET    /api/v1/organizations/:id(.:format)                                                      api/v1/organizations#show
#                                          PATCH  /api/v1/organizations/:id(.:format)                                                      api/v1/organizations#update
#                                          PUT    /api/v1/organizations/:id(.:format)                                                      api/v1/organizations#update
#                                          DELETE /api/v1/organizations/:id(.:format)                                                      api/v1/organizations#destroy
#                        api_v1_predicates GET    /api/v1/predicates(.:format)                                                             api/v1/predicates#index
#                             api_v1_roles GET    /api/v1/roles(.:format)                                                                  api/v1/roles#index
#                    api_v1_specifications POST   /api/v1/specifications(.:format)                                                         api/v1/specifications#create
#                     api_v1_specification GET    /api/v1/specifications/:id(.:format)                                                     api/v1/specifications#show
#                                          DELETE /api/v1/specifications/:id(.:format)                                                     api/v1/specifications#destroy
#                       api_v1_spine_terms POST   /api/v1/spine_terms(.:format)                                                            api/v1/spine_terms#create
#                              api_v1_term GET    /api/v1/terms/:id(.:format)                                                              api/v1/terms#show
#                                          PATCH  /api/v1/terms/:id(.:format)                                                              api/v1/terms#update
#                                          PUT    /api/v1/terms/:id(.:format)                                                              api/v1/terms#update
#                                          DELETE /api/v1/terms/:id(.:format)                                                              api/v1/terms#destroy
#              api_v1_spine_specifications GET    /api/v1/spine_specifications(.:format)                                                   api/v1/spine_specifications#index
#               api_v1_spine_specification GET    /api/v1/spine_specifications/:id(.:format)                                               api/v1/spine_specifications#show
#                            api_v1_admins GET    /api/v1/admins(.:format)                                                                 api/v1/admins#index
#                                          POST   /api/v1/admins(.:format)                                                                 api/v1/admins#create
#                             api_v1_admin PATCH  /api/v1/admins/:id(.:format)                                                             api/v1/admins#update
#                                          PUT    /api/v1/admins/:id(.:format)                                                             api/v1/admins#update
#                                          DELETE /api/v1/admins/:id(.:format)                                                             api/v1/admins#destroy
# set_current_api_v1_configuration_profile GET    /api/v1/configuration_profiles/:id/set_current(.:format)                                 api/v1/configuration_profiles#set_current
#     import_api_v1_configuration_profiles POST   /api/v1/configuration_profiles/import(.:format)                                          api/v1/configuration_profiles#import
#            api_v1_configuration_profiles GET    /api/v1/configuration_profiles(.:format)                                                 api/v1/configuration_profiles#index
#                                          POST   /api/v1/configuration_profiles(.:format)                                                 api/v1/configuration_profiles#create
#             api_v1_configuration_profile GET    /api/v1/configuration_profiles/:id(.:format)                                             api/v1/configuration_profiles#show
#                                          PATCH  /api/v1/configuration_profiles/:id(.:format)                                             api/v1/configuration_profiles#update
#                                          PUT    /api/v1/configuration_profiles/:id(.:format)                                             api/v1/configuration_profiles#update
#                                          DELETE /api/v1/configuration_profiles/:id(.:format)                                             api/v1/configuration_profiles#destroy
#              extract_api_v1_vocabularies POST   /api/v1/vocabularies/extract(.:format)                                                   api/v1/vocabularies#extract
#                      api_v1_vocabularies GET    /api/v1/vocabularies(.:format)                                                           api/v1/vocabularies#index
#                                          POST   /api/v1/vocabularies(.:format)                                                           api/v1/vocabularies#create
#                        api_v1_vocabulary GET    /api/v1/vocabularies/:id(.:format)                                                       api/v1/vocabularies#show
#                                   api_v1 POST   /api/v1/mappings/:id/selected_terms(.:format)                                            api/v1/mapping_selected_terms#create
#                                          GET    /api/v1/mappings/:id/selected_terms(.:format)                                            api/v1/mapping_selected_terms#show
#                                          GET    /api/v1/mappings/:id/export(.:format)                                                    api/v1/mappings#export
#                                          DELETE /api/v1/mappings/:id/selected_terms(.:format)                                            api/v1/mapping_selected_terms#destroy
#                                          GET    /api/v1/alignments/:id/vocabulary(.:format)                                              api/v1/alignment_vocabularies#show
#                                          GET    /api/v1/mappings/:id/terms(.:format)                                                     api/v1/mappings#show_terms
#                                          POST   /api/v1/mappings/:mapping_id/alignments(.:format)                                        api/v1/alignments#create
#                                          POST   /api/v1/merged_files/:id/classes(.:format)                                               api/v1/merged_files#classes
#                                          POST   /api/v1/merged_files/:id/filter(.:format)                                                api/v1/merged_files#filter
#                                          GET    /api/v1/specifications/:id/terms(.:format)                                               api/v1/terms#index
#                                          GET    /api/v1/vocabularies/:id/flat(.:format)                                                  api/v1/vocabularies#flat
#                                          POST   /api/v1/configuration_profiles/:id/action(.:format)                                      api/v1/configuration_profile_actions#call_action
#      api_v1_configuration_profile_schema GET    /api/v1/configuration_profile_schema(.:format)                                           api/v1/configuration_profile_schemas#show
#    api_v1_validate_configuration_profile POST   /api/v1/validate_configuration_profile(.:format)                                         api/v1/validate_configuration_profile#validate
#                        api_v1_skos_fetch POST   /api/v1/skos/fetch(.:format)                                                             api/v1/skos#fetch
#                       api_v1_skos_labels GET    /api/v1/skos/labels(.:format)                                                            api/v1/skos#labels
#                                          GET    /api/v1/spines/:id/terms(.:format)                                                       api/v1/spine_terms#index
#         resources_mapping_export_profile GET    /resources/mapping_export_profile(.:format)                                              resources/mapping_export_profile#show
#                                resources GET    /resources/abstract-classes/:slug(.:format)                                              resources/abstract_classes#show
#            resources_abstract_class_sets GET    /resources/abstract-class-sets(.:format)                                                 resources/abstract_class_sets#index
#                                          GET    /resources/abstract-class-sets/:slug(.:format)                                           resources/abstract_class_sets#show
#         resources_configuration_profiles GET    /resources/configuration-profiles(.:format)                                              resources/configuration_profiles#index
#                                          GET    /resources/configuration-profiles/:slug(.:format)                                        resources/configuration_profiles#show
#                                          GET    /resources/abstract-classes/:slug(.:format)                                              resources/domains#show
#                  resources_organizations GET    /resources/organizations(.:format)                                                       resources/organizations#index
#                                          GET    /resources/organizations/:slug(.:format)                                                 resources/organizations#show
#                                          GET    /resources/predicates/:slug(.:format)                                                    resources/predicates#show
#                                          GET    /resources/predicate-sets/:slug(.:format)                                                resources/predicate_sets#show
#                 resources_predicate_sets GET    /resources/predicate-sets(.:format)                                                      resources/predicate_sets#index
#                                          GET    /resources/terms/:slug(.:format)                                                         resources/terms#show
#                 resources_specifications GET    /resources/specifications(.:format)                                                      resources/specifications#index
#                                          GET    /resources/specifications/:slug(.:format)                                                resources/specifications#show
#                         resources_spines GET    /resources/spines(.:format)                                                              resources/spines#index
#                                          GET    /resources/spines/:slug(.:format)                                                        resources/spines#show
#                                    users GET    /users(.:format)                                                                         users#index
#                                     user GET    /users/:id(.:format)                                                                     users#show
#                                          PATCH  /users/:id(.:format)                                                                     users#update
#                                          PUT    /users/:id(.:format)                                                                     users#update
#                                          DELETE /users/:id(.:format)                                                                     users#destroy
#                                          GET    /*path(.:format)                                                                         homepage#index
#            rails_postmark_inbound_emails POST   /rails/action_mailbox/postmark/inbound_emails(.:format)                                  action_mailbox/ingresses/postmark/inbound_emails#create
#               rails_relay_inbound_emails POST   /rails/action_mailbox/relay/inbound_emails(.:format)                                     action_mailbox/ingresses/relay/inbound_emails#create
#            rails_sendgrid_inbound_emails POST   /rails/action_mailbox/sendgrid/inbound_emails(.:format)                                  action_mailbox/ingresses/sendgrid/inbound_emails#create
#      rails_mandrill_inbound_health_check GET    /rails/action_mailbox/mandrill/inbound_emails(.:format)                                  action_mailbox/ingresses/mandrill/inbound_emails#health_check
#            rails_mandrill_inbound_emails POST   /rails/action_mailbox/mandrill/inbound_emails(.:format)                                  action_mailbox/ingresses/mandrill/inbound_emails#create
#             rails_mailgun_inbound_emails POST   /rails/action_mailbox/mailgun/inbound_emails/mime(.:format)                              action_mailbox/ingresses/mailgun/inbound_emails#create
#           rails_conductor_inbound_emails GET    /rails/conductor/action_mailbox/inbound_emails(.:format)                                 rails/conductor/action_mailbox/inbound_emails#index
#                                          POST   /rails/conductor/action_mailbox/inbound_emails(.:format)                                 rails/conductor/action_mailbox/inbound_emails#create
#        new_rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/new(.:format)                             rails/conductor/action_mailbox/inbound_emails#new
#       edit_rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/:id/edit(.:format)                        rails/conductor/action_mailbox/inbound_emails#edit
#            rails_conductor_inbound_email GET    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#show
#                                          PATCH  /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#update
#                                          PUT    /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#update
#                                          DELETE /rails/conductor/action_mailbox/inbound_emails/:id(.:format)                             rails/conductor/action_mailbox/inbound_emails#destroy
#    rails_conductor_inbound_email_reroute POST   /rails/conductor/action_mailbox/:inbound_email_id/reroute(.:format)                      rails/conductor/action_mailbox/reroutes#create
#                       rails_service_blob GET    /rails/active_storage/blobs/:signed_id/*filename(.:format)                               active_storage/blobs#show
#                rails_blob_representation GET    /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations#show
#                       rails_disk_service GET    /rails/active_storage/disk/:encoded_key/*filename(.:format)                              active_storage/disk#show
#                update_rails_disk_service PUT    /rails/active_storage/disk/:encoded_token(.:format)                                      active_storage/disk#update
#                     rails_direct_uploads POST   /rails/active_storage/direct_uploads(.:format)                                           active_storage/direct_uploads#create

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

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :alignments, only: [:destroy, :index, :update]
      resources :alignment_vocabulary_concepts, only: [:update]
      resources :alignment_synthetic_concepts, only: [:create]
      resources :audits, only: [:index]
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
      resources :admins, except: %i(new show edit)

      resources :configuration_profiles, except: %i[new edit] do
        get :set_current, on: :member
        post :import, on: :collection
      end

      resources :vocabularies, only: [:index, :create, :show] do
        post :extract, on: :collection
      end

      # Mapping selected terms
      post 'mappings/:id/selected_terms' => 'mapping_selected_terms#create'
      get 'mappings/:id/selected_terms' => 'mapping_selected_terms#show', as: :mapping_selected_terms
      get 'mappings/:id/export' => 'mappings#export'
      delete 'mappings/:id/selected_terms' => 'mapping_selected_terms#destroy'

      get 'alignments/:id/vocabulary' => 'alignment_vocabularies#show'
      get 'mappings/:id/terms' => 'mappings#show_terms', as: :mapping_terms
      post 'mappings/:mapping_id/alignments' => 'alignments#create'
      post 'merged_files/:id/classes' => 'merged_files#classes'
      post 'merged_files/:id/filter' => 'merged_files#filter'
      get 'specifications/:id/terms' => 'terms#index', as: :specification_terms
      get 'vocabularies/:id/flat' => 'vocabularies#flat'
      post 'configuration_profiles/:id/action' => 'configuration_profile_actions#call_action'
      get 'configuration_profile_schema' => 'configuration_profile_schemas#show'
      post 'validate_configuration_profile' => 'validate_configuration_profile#validate'

      post 'skos/fetch' => 'skos#fetch'
      get 'skos/labels' => 'skos#labels'

      get 'spines/:id/terms' => 'spine_terms#index', as: :spine_terms_list
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
