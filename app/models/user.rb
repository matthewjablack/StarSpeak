class User < ActiveRecord::Base
  attr_accessor :skip_password_validation
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, 
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :registerable

  before_save :ensure_authentication_token


  belongs_to :level
  belongs_to :betacode

  has_many :speech_stats

  before_save :full_name


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

  def full_name
    if !self.first_name.nil? && !self.last_name.nil?
      if self.name != (self.first_name + " " + self.last_name)
        self.update_attribute(:name, self.first_name + " " + self.last_name)
      end
    end
  end

  def generate_reset_token
    raw, enc = Devise.token_generator.generate(self.class, :reset_password_token)

    self.reset_password_token   = enc
    self.reset_password_sent_at = Time.now.utc
    self.save(validate: false)

    return raw
  end

  private

  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(auth_token: token).first
    end
  end

  protected

  def password_required?
    return false if skip_password_validation
    super
  end


end
