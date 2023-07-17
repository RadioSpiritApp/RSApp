class Subscription < ApplicationRecord
  belongs_to :plan, optional: true
  belongs_to :user

  RS = 'RsSubscription'
  RV = 'RvSubscription'
  SUBSCRIPTION_TYPES = [RS, RV]

  # Scopes
  scope :active, ->{where("expiry_date > ?", Date.today)}
  scope :rv, ->{where(type: RV)}
  scope :rs, ->{where(type: RS)}

  before_validation :assign_type, on: %i[create update]

  attr_accessor :subscription_type

  def assign_type
    return true if self.type.present?
    self.type = subscription_type.present? ? subscription_type : RS
  end

  def is_active?
    exp_date = Rails.env.production? ? expiry_date : expiry_date + 1.day
    exp_date >= Date.today
  end

  # class methods
  class << self
    def filter_by_type(type)
      if type.present?
        Subscription.where("subscriptions.type = ?", type)
      else
        Subscription.all
      end
    end
  end
end
