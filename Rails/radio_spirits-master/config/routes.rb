Rails.application.routes.draw do
  require 'sidekiq/web'
  devise_scope :user do
    # root to: "sessions#new"
  end

  devise_for :users, controllers: { sessions: 'sessions',
                                    registrations: 'registrations' }
  mount API::Base => '/'
  mount GrapeSwaggerRails::Engine => '/swagger'
  mount Sidekiq::Web, at: '/sidekiq'

  get '/home', to: 'dashboard#home'
  root to: 'dashboard#home'
  namespace :admin do
    resources :dashboard, only: [:index]
    resources :genres do
      post :activate_deactivate
    end
    resources :onboarding_buckets, except: :show do
      post :activate_deactivate
      post :empty
    end
    resources :subscription_buckets, except: :show do
      post :activate_deactivate
    end
    resources :plans, except: :show do
      post :activate_deactivate
    end
    resources :series do
      post :activate_deactivate
      collection do
        get :downlaod_sample_csv
        post :upload_csv
        delete :destroy_all
      end
    end
    resources :episodes do
      post :activate_deactivate
      collection do
        get :downlaod_sample_csv
        post :upload_episodes_from_csv
        get :downlaod_error_file
        get :import_episode
      end
    end
    resources :advertisements, except: :show do
      post :activate_deactivate
    end
    resources :settings, except: [:create, :destroy, :new]
    resources :copy_texts, only: :index
    get 'copy_texts/:page_name/edit', to: "copy_texts#edit_page_details", as: 'edit_page_details'
    post 'copy_texts/:page_name', to: "copy_texts#update_page_details", as: 'update_copy_texts'
    get '/edit_home_page_content', to: 'settings#edit_home_page_content'
    post '/update_home_page_content', to: 'settings#update_home_page_content'
    post '/read_notification', to: 'users#read_notification'
    resources :images, only: [:index, :destroy] do
      collection do
        post :image_bulk_upload
        post :copy_image
        put :update_image
      end
    end

    resources :audios, only: [:index, :destroy] do
      collection do
        post :bulk_upload
        post :copy_audio
        put :update_audio
      end
    end

    resources :users, only: :index do
      post :suspend_or_activate
      collection do
        get :subscriptions
      end
    end
  end
  get 'users/confirm_email', to: 'users#confirm_email'
end
