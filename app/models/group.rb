include URLify

class Group < ApplicationRecord
  has_many :group_memberships
  has_many :users, :through => :group_memberships

  before_save :urlify

  def urlify
    self.url = self.name.parameterize
    self.url = URLify.urlify(self.url)
  end
end
