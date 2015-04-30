Rails.application.routes.draw do
  
  root "lockers#index"

  resources :lockers

  resources :sessions, only: [:new, :create] do
    delete :destroy, on: :collection
  end

  resources :users
end
