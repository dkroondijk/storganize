class LockersController < ApplicationController
  before_action :authenticate_user!

  def index
    @lockers = Locker.all

    @locker = Locker.new
  end

  def create
    @locker = current_user.lockers.new(locker_params)
    if @locker.save
      redirect_to locker_path(@locker), notice: "New Locker Added!"
    else
      render :index
      flash[:alert] = "Can't Create Locker!"
    end
  end

  def show
    @locker = Locker.find(params[:id])
    @box = Box.new
  end


  private

  def locker_params
    params.require(:locker).permit(:name, :length, :width)
  end
end
