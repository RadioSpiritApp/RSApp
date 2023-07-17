class Identity < ApplicationRecord
  # Associations
  belongs_to :user, optional: true

  # Validations
  validates :provider, presence: true
  validates :uid, presence: true, uniqueness: { scope: :provider }

  def self.find_for_oauth(auth_provider, auth_uid)
    find_or_create_by(provider: auth_provider, uid: auth_uid)
  end
end
