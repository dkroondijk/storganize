class Tag < ActiveRecord::Base
  has_many :taggings
  has_many :tagged_boxes, through: :taggings, source: :box

  validates :name, presence: :true
end
