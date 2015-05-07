class AddColumnToLockers < ActiveRecord::Migration
  def change
    add_column :lockers, :scene_json, :text
  end
end
