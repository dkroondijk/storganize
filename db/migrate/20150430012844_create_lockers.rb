class CreateLockers < ActiveRecord::Migration
  def change
    create_table :lockers do |t|
      t.string :name
      t.integer :length
      t.integer :width
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
