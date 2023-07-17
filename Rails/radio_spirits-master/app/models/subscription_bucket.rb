class SubscriptionBucket < ApplicationRecord
  has_many :users
  has_many :subscription_bucket_plans, dependent: :destroy
  has_many :plans, through: :subscription_bucket_plans
  has_many :devices, dependent: :destroy

  # Validations
  validates :weight, numericality: { greater_than_or_equal_to: 0 }

  # Callbacks
  after_save :update_array, if: :need_to_update_array?
  after_update :update_array, if: :need_to_update_array?
  after_destroy :update_array

  scope :active, -> { where(active: true) }
  scope :search, ->(title) { where("title ILIKE ?", "%#{title}%") }

  def update_array
  	data = YAML.load_file('config/bucket_array.yml')
  	data["subscription_bucket"]["array"].clear
  	data["subscription_bucket"]["array"] = Device.repopulate_array(SubscriptionBucket)
    File.open("config/bucket_array.yml", 'w') { |f| YAML.dump(data, f) }
  end

  def need_to_update_array?
    saved_change_to_weight? || saved_change_to_active?
  end
end
