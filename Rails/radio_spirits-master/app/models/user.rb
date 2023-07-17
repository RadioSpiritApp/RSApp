# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :validatable, authentication_keys: [:login]

  ADMIN = 'Admin'
  SUBSCRIBER = 'Subscriber'
  ROLES = [ADMIN, SUBSCRIBER]

  # Associations
  has_many :access_tokens, dependent: :destroy
  has_many :identities, dependent: :destroy
  has_many :devices, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :recent_streams, dependent: :destroy
  has_many :email_confirmations, dependent: :destroy
  has_many :plays, dependent: :destroy
  has_many :wrw_plays, dependent: :destroy

  # Validations
  validates_presence_of :email, if: :email_required?
  validates :email, uniqueness: { case_sensitive: false }, if: -> { email.present? }
  validates :transaction_identifier, uniqueness: { case_sensitive: false }, if: -> { transaction_identifier.present? }

  # Scopes
  scope :with_email, ->(email) {where(email: email)}
  scope :search, ->(title) { where("email ILIKE ?", "%#{title}%") }


  # Callbacks
  before_validation :assign_type, on: %i[create update]

  attr_accessor :role, :skip_password_validation, :login

  def login=(login)
    @login = login
  end

  def login
    @login || self.transaction_identifier || self.email
  end

  def assign_type
    return true if self.type.present?
    self.type = role.present? ? role : SUBSCRIBER
  end

  def admin?
    type == ADMIN
  end

  def subscriber?
    type == SUBSCRIBER
  end

  def has_active_subscription_on?(platform, access_token)
    return true if get_user_type(access_token) == 'RadioVault'
    return false if platform.nil?
    subscriptions.where("expiry_date >= ? AND platform = ? AND type = 'RsSubscription'", Date.today, platform).exists?
  end

  def continue_listening_episodes_for_homepage
    episode = Episode.paid.listing.with_audio_episodes.joins(:bookmarks).where("(episodes.duration - bookmarks.seek_time) > ? AND bookmarks.seek_time > ?", 60, 5).where("bookmarks.user_id = ? ", self.id)
    e_ids = episode.joins(:recent_streams).order("recent_streams.played_at desc").pluck(:id).uniq
    Episode.where(id: e_ids).order_as_specified(id: e_ids)
  end

  def episodes_for_continue_listening
    episode = Episode.paid.listing.with_audio_episodes.joins(:bookmarks).where("(episodes.duration - bookmarks.seek_time) > ? AND bookmarks.seek_time > ?", 60, 5).where("bookmarks.user_id = ? ", self.id)
    episode.joins(:recent_streams).order("recent_streams.played_at desc")
  end

  def episodes_for_continue_listening_with_wrw
    episodes = episodes_for_continue_listening
    free_episodes_hash = Episode.get_free_episodes_by_played_at(episodes.free)
    paid_episodes_hash = Episode.get_paid_episodes_by_played_at(self, episodes.paid)
    result = free_episodes_hash.merge(paid_episodes_hash)
    result.sort_by{|key| key}.reverse.to_h.values
  end

  def get_more_of
    recently_viewed_series_ids = Episode.joins(:recent_streams).paid.listing.with_audio_episodes.where("recent_streams.user_id": self.id).order("recent_streams.played_at desc").map(&:series_id).uniq.first(15)
    recently_viewed_series = recently_viewed_series_ids.collect {|i| Series.available.find(i) }
    recently_viewed_genres = []
    recently_viewed_series.each do |series|
      recently_viewed_genres << series.genres
    end
    return recently_viewed_series.uniq.first(7), recently_viewed_genres.flatten.uniq.first(7)
  end

  def send_email_confirmation(device_id)
    EmailConfirmation.where("user_id = ? AND device_id = ? AND confirmed = FALSE", id, device_id).destroy_all
    exp = Time.current.to_i + Globalconstants::EMAIL_CONFIRMATION_EXPIRY_IN_DAYS.days.to_i
    exp_payload = { :data => email, :exp => exp }
    token = JWT.encode exp_payload, $secret[:api_hmac_secret], 'HS256'
    email_confirmation = email_confirmations.build(device_id: device_id, confirmation_token: token)
    email_confirmation.save
    UserMailer.email_confirmation(email, token).deliver!
  end

  def confirmed?
    self.email_confirmations.pending.blank?
  end

  def unlink_other_device!
    Device.where(user_id: id).update_all(user_id: nil)
  end

  def get_user_type access_token
    return 'RadioSpirits' if subscriptions.blank?
    access_token.present? && access_token.is_rv_subscribed ? 'RadioVault' : 'RadioSpirits'
  end

  def confirmed_on_device(device_udid)
    device = Device.find_by(udid: device_udid) rescue nil
    return false if device.nil?
    email_confirmations.where(device_id: device.id).pending.blank?
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions.to_h).where(["lower(transaction_identifier) = :value OR lower(email) = :value", { :value => login.downcase }]).first
    elsif conditions.has_key?(:transaction_identifier) || conditions.has_key?(:email)
      where(conditions.to_h).first
    end
  end

  def subscription_with_identifier(transaction_identifier)
    subscriptions.where(transaction_identifier: transaction_identifier)
  end

  def email_verification_pending?
    email_confirmations.where(confirmed: true).blank?
  end

  def is_rv?(access_token)
    return false if subscriptions.rv.active.blank?
    access_token.present? && access_token.is_rv_subscribed ? true : false
  end

  private
    def password_required?
      return false if skip_password_validation
      super
    end

    def email_required?
      return false if login.present?
      super
    end
end
