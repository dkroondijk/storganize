class Box < ActiveRecord::Base
  belongs_to :locker
  has_many :items

  validates :name, presence: :true
end
