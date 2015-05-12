class WelcomeController < ApplicationController

  layout "external"
  before_action :logged_in?

  def index
    
  end


  private

  def logged_in?
    if current_user.present?
      redirect_to lockers_path
    end
  end
end
