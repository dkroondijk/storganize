class CreateBoxes < ActiveRecord::Migration
  def change
    create_table :boxes do |t|
      t.string :name
      t.integer :cube_id
      t.integer :x
      t.integer :y
      t.integer :z
      t.references :locker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
