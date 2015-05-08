class ChangeCubeIdDataType < ActiveRecord::Migration
  def change
    change_column :boxes, :cube_id, :string
  end
end
