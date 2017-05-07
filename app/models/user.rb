class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, 
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :registerable

  before_save :ensure_authentication_token


  belongs_to :level
  belongs_to :betacode


  def self.find_for_facebook_oauth(auth, signed_in_resource=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      user = User.create(name:     auth.extra.raw_info.name,
                         provider: auth.provider,
                         uid:      auth.uid,
                         email:    auth.info.email,
                         password: Devise.friendly_token[0,20]
                        )
    end
    user
  end
 
  def self.find_for_twitter_oauth(auth, signed_in_resource=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first
    unless user
      user = User.create(name:     auth.info.nickname,
                         provider: auth.provider,
                         uid:      auth.uid,
                         email:    User.create_unique_email,
                         password: Devise.friendly_token[0,20]
                        )
    end
    user
  end
 
  def self.create_unique_string
    SecureRandom.uuid
  end
 
  def self.create_unique_email
    User.create_unique_string + "@example.com"
  end

  def ensure_authentication_token
    self.auth_token ||= generate_authentication_token
  end


  private

    def generate_authentication_token
      loop do
        token = Devise.friendly_token
        break token unless User.where(auth_token: token).first
      end
    end


end
