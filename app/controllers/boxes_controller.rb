class BoxesController < ApplicationController


  def create
    @locker = Locker.find(params[:locker_id])
    @box = Box.new(box_params)
    @box.locker = @locker

    if @box.save
      redirect_to locker_path(@locker), notice: "Box Added"
    else
      render "/lockers/#{@locker.id}"
      flash[:alert] = "Can't add box!"
    end  
  end


  private

  def box_params
    params.require(:box).permit(:name, {items_attributes: [:name, :id, :_destroy]})
  end
end
