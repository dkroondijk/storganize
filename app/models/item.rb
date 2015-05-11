class Item < ActiveRecord::Base
  belongs_to :box

  validates :name, presence: true
end
