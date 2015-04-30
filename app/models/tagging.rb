class Tagging < ActiveRecord::Base
  belongs_to :box
  belongs_to :tag
end
