Rails.application.routes.draw do
  
  root "lockers#index"

  resources :lockers do
    resources :boxes do
      resources :items, only: [:create, :update]
    end
  end

  resources :sessions, only: [:new, :create] do
    delete :destroy, on: :collection
  end

  resources :users
end
