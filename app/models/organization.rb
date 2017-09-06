include URLify

class Organization < ApplicationRecord
  has_many :organization_memberships
  has_many :users, :through => :organization_memberships

  before_save :urlify

  def urlify
    self.url = self.name.parameterize
    self.url = URLify.urlify(self.url)
  end
end
