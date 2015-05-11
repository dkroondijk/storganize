class ItemsController < ApplicationController

  def create
    @locker = Locker.find(params[:locker_id])
    @box = Box.find(params[:box_id])
    @item = Item.new(item_params)
    @item.box = @box

    respond_to do |format|
      if @item.save
        format.html { redirect_to locker_path(@locker), notice: "Item Added" }
        format.js { render }
      else
        format.html { render "lockers/show" }
        format.js { render }
      end
    end
  end

  def update
    @locker = Locker.find(params[:locker_id])
    @box = Box.find(params[:box_id])
    @item = Item.find(params[:id])

    respond_to do |format|
      if @item.update(item_params)
        format.json {respond_with_bip(@item)}
      else
        
      end
    end
  end


  private

  def item_params
    params.require(:item).permit(:name)
  end
end
