require 'sidekiq/web'

StarSpeak::Application.routes.draw do
  get 'hello_world', to: 'hello_world#index'
  ActiveAdmin.routes(self)
  devise_for :users, :controllers => {
    :registrations => "users/registrations",
    :omniauth_callbacks => "users/omniauth_callbacks"
  }
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  mount Sidekiq::Web => '/sidekiq'

  namespace :api do
    namespace :v1, defaults: { format: 'json' } do
      match 'lesson/:id' => 'lessons#show', via: [:get, :post], as: :lesson_api
      post 'speech_stats' => 'speech_stats#create'
      get 'speech_stats' => 'speech_stats#index'
      post 'watson_tone' => 'services#watson_tone'
      resources :videos, only: [:index, :create]
      resources :uploads, only: [:create]
      resources :ip_sessions, only: [:create]
      post 'dalechall' => 'speech_stats#dale_chall'
    end
  end



  root 'home#index'

  get "dashboard" => "home#dashboard"
  get "appleby" => "home#appleby"


  match '/levels' => 'levels#index', via: [:get], as: :levels


  get '/privacy' => 'pages#privacy', via: [:get], as: :privacy
  get '/terms' => 'pages#terms', via: [:get], as: :terms
  get '/help' => 'pages#help', via: [:get], as: :help
  get '/upload' => 'pages#upload', via: [:get], as: :upload
  get '/render_result_dev' => 'pages#render_result_dev', via: [:get], as: :render_result_dev
  get '/render_record_dev' => 'pages#render_record_dev', via: [:get], as: :render_record_dev
  get '/render_preload_loading_dev' => 'pages#render_preload_loading_dev', via: [:get], as: :render_preload_loading_dev
  get '/render_preload_loaded_dev' => 'pages#render_preload_loaded_dev', via: [:get], as: :render_preload_loaded_dev

  get '/starlight' => 'pages#starlight', via: [:get], as: :starlight_demo

  get 'dalechall' => 'speech_stats#dale_chall'


  resources :users, only: [:show, :create] do
    collection do
      get :magic_link
      post :magic_create
    end
    member do
      get :magic_link_show
    end
  end

  resources :speechstats, only: [:index, :show]

  resources :levels, only: [:show], path: '' do
    resources :modulers, only: [:index], path: '' do
      resources :lessons, only: [:index, :show]
    end
  end




  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
