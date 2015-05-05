Rails.application.routes.draw do
  
  root "lockers#index"

  resources :lockers do
    resources :boxes
  end

  resources :sessions, only: [:new, :create] do
    delete :destroy, on: :collection
  end

  resources :users
end
