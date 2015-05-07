class Box < ActiveRecord::Base
  belongs_to :locker
  has_many :items, dependent: :destroy
  accepts_nested_attributes_for :items, reject_if: lambda {|x| x[:name].blank? }, allow_destroy: true

  validates :name, presence: :true
end
