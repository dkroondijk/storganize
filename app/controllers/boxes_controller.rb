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
        format.json { render json: @box }
      else      
        format.html { render "lockers/show" }
        format.js { render }
      end   
    end
  end

  def update
    @locker = Locker.find(params[:locker_id])
    @box = Box.find(params[:id])

    respond_to do |format|
      if @box.update(box_params)
        format.html { redirect_to locker_path(@locker), notice: "Box Updated" }
        format.json { render json: {} }
      else
        format.html { render "/lockers/show" }
        format.json { render json: {} }
      end
    end
  end

  def show
    
  end

  def destroy
    @locker = Locker.find(params[:locker_id])
    @box = Box.find(params[:id])

    @box.destroy
    respond_to do |format|
      format.html { redirect_to locker_path(@locker) }
      format.json { head :no_content }   
    end
  end


  private

  def box_params
    params.require(:box).permit(:name, :x, :y, :z, :cube_id, {items_attributes: [:name, :id, :_destroy]})
  end
end
