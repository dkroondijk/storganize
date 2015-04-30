class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.references :user, index: true, foreign_key: true
      t.references :locker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
