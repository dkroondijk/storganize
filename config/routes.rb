Rails.application.routes.draw do
  
  root "welcome#index"

  resources :lockers do
    resources :boxes do
      resources :items, only: [:create, :update, :destroy]
    end
  end

  resources :sessions, only: [:new, :create] do
    delete :destroy, on: :collection
  end

  resources :users
end
