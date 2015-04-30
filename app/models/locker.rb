class Locker < ActiveRecord::Base
  belongs_to :user
  has_many :boxes, dependent: :destroy

  validates :name, presence: :true
  validates :length, presence: :true
  validates :width, presence: :true
end
