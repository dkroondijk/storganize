class LockersController < ApplicationController
  before_action :authenticate_user!

  def index
    @lockers = current_user.lockers

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
    @item = Item.new
  end

  def update
    @locker = Locker.find(params[:id])
    respond_to do |format|
      if @locker.update(locker_params)
        format.html { render "/lockers/show" }
        format.json { respond_with_bip(@locker) }
      else
        format.html { 
          render :show 
          flash[:alert] = "Can't save locker"
        }
        format.json { render json: {} }
      end
    end
  end


  private

  def locker_params
    params.require(:locker).permit(:name, :length, :width, :scene_json)
  end
end
