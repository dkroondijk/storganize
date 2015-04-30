class User < ActiveRecord::Base

  has_secure_password

  has_many :lockers, dependent: :destroy

  validates :first_name, presence: :true
  validates :last_name, presence: :true
  validates :email, presence: :true
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, 
                              :on => :create

  def full_name
    ("#{first_name} #{last_name}").strip
  end

end
