class BoxesController < ApplicationController

  def index
    @locker = Locker.find(params[:locker_id])
    @boxes = @locker.boxes
    render json: @boxes
  end


  def create
    @locker = Locker.find(params[:locker_id])
    @box = Box.new(box_params)
    @box.locker = @locker

    respond_to do |format|
      if @box.save
        format.html { redirect_to locker_path(@locker), notice: "Box Added" }
        format.json { render @box }
      else
        # render "/lockers/#{@locker.id}"
        
        format.html { 
          render "lockers/show"
          flash[:alert] = "Can't add box!"
        }
        format.js { render }
      end   
    end

  end

  def update
    @box = Box.find(params[:id])
    if @box.update(box_params)
      render "/lockers/show"
    else
      render "/lockers/show"
    end
  end

  def show
    
  end


  private

  def box_params
    params.require(:box).permit(:name, :x, :y, :z, :cube_id, {items_attributes: [:name, :id, :_destroy]})
  end
end
