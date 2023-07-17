class Plan < ApplicationRecord
  has_many :subscription_bucket_plans, dependent: :destroy
  has_many :subscription_buckets, through: :subscription_bucket_plans

  scope :active, -> { where(active: true) }
  scope :search, ->(title) { where("title ILIKE ?", "%#{title}%") }

  def validity_text
    case self.validity
    when 7
      "1 Week"
    when 30
      "1 Month"
    when 60
      "2 Months"
    when 90
      "3 Months"
    when 180
      "6 Months"
    when 365
      "12 Months"
    end
  end
end
