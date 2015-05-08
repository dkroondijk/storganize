class Box < ActiveRecord::Base
  belongs_to :locker
  has_many :items, dependent: :destroy
  accepts_nested_attributes_for :items, reject_if: lambda {|x| x[:name].blank? }, allow_destroy: true

  validates :name, presence: :true

  # before_create :set_cube_id

  # def set_cube_id
  #   self.cube_id = self.x.to_s + self.y.to_s + self.z.to_s
  # end
end
