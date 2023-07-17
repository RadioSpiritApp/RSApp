class Device < ApplicationRecord
  belongs_to :onboarding_bucket, optional: true
  belongs_to :subscription_bucket, optional: true
  belongs_to :user, optional: true
  has_many :email_confirmations, dependent: :destroy
  has_many :access_tokens, dependent: :destroy
  has_many :plays, dependent: :destroy
  has_many :wrw_plays, dependent: :destroy

  # Validations
  validates_presence_of :udid, :device_name, :fcm_token, :device_type, :device_locale, :timezone
  validates_uniqueness_of :udid
  validates_uniqueness_of :reference_id, if: -> { reference_id.present? }

  # Scopes
  scope :with_udid, ->(udid) {where(udid: udid)}

  # Callbacks
  before_save :generate_reference_id

  def allocate_onboarding_bucket
    data = YAML.load_file('config/bucket_array.yml')
    bucket_array = data["onboarding_bucket"]["array"].present? ? data["onboarding_bucket"]["array"] : Device.repopulate_array(OnboardingBucket)
    bucket_id = bucket_array.delete_at(rand(bucket_array.length))
    data["onboarding_bucket"]["array"] = bucket_array
    File.open("config/bucket_array.yml", 'w') { |f| YAML.dump(data, f) }
    self.onboarding_bucket_id = bucket_id
    self.save
  end

  def previous_device
    Device.where("id < ?", id).last
  end

  def confirmed?
    self.email_confirmations.pending.blank?
  end

  def get_bucket_details
    device_lifetime = (Time.current.to_date - device.created_at.to_date).to_i
    show_skip = device_lifetime < (onboarding_bucket.show_signup_after + onboarding_bucket.skip_signup_for)
    {show_rv_login: onboarding_bucket.show_rv_login, show_email: onboarding_bucket.show_signup, show_skip: show_skip}
  end

  def allocate_subscription_bucket
    data = YAML.load_file('config/bucket_array.yml')
    bucket_array = data["subscription_bucket"]["array"].present? ? data["subscription_bucket"]["array"] : Device.repopulate_array(SubscriptionBucket)
    bucket_id = bucket_array.delete_at(rand(bucket_array.length))
    data["subscription_bucket"]["array"] = bucket_array
    File.open("config/bucket_array.yml", 'w') { |f| YAML.dump(data, f) }
    self.subscription_bucket_id = bucket_id
    self.save
  end

  def get_plan_id_for(product_id)
    if device_type.to_s.downcase == "android"
      Plan.find_by(play_store_id: product_id) rescue nil
    elsif device_type.to_s.downcase == "ios"
      Plan.find_by(itunes_id: product_id) rescue nil
    end
  end

  # class methods
  class << self
    def repopulate_array(bucket)
      buckets = bucket.active
      bucket_ids = []
      buckets.each do |bucket|
        bucket.weight.times do |bucket_w|
          bucket_ids  << bucket.id
        end
      end
      return bucket_ids
    end
  end

  private

    def generate_reference_id
      if self.reference_id.nil?
        assigned_ref_ids = Device.pluck(:reference_id)
        ref_id = "REF-" + rand.to_s[2..8]
        ref_id = "REF-" + rand.to_s[2..8] while assigned_ref_ids.include?(ref_id)
        self.reference_id = ref_id
      end
    end
end
