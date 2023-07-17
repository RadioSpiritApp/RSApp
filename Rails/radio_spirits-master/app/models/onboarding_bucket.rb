class OnboardingBucket < ApplicationRecord
  has_many :devices, dependent: :destroy
  scope :active, -> { where(active: true) }
  scope :search, ->(title) { where("title ILIKE ?", "%#{title}%") }

  #validations
  validates :weight, numericality: { greater_than_or_equal_to: 0 }

  #callbacks
  after_save :update_array, if: :need_to_update_array?
  after_update :update_array, if: :need_to_update_array?
  after_destroy :update_array

  def destroy_linked_subscribers
    User.joins(:devices).where("devices.id IN (?)", devices.pluck(:id)).destroy_all
    devices.destroy_all
  end

  def update_array
  	data = YAML.load_file('config/bucket_array.yml')
  	data["onboarding_bucket"]["array"].clear
  	data["onboarding_bucket"]["array"] = Device.repopulate_array(OnboardingBucket)
    File.open("config/bucket_array.yml", 'w') { |f| YAML.dump(data, f) }
  end

  def need_to_update_array?
    saved_change_to_weight? || saved_change_to_active?
  end
end
