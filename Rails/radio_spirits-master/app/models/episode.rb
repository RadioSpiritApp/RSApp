class Episode < ApplicationRecord
  extend OrderAsSpecified
  # Associations
  belongs_to :series, counter_cache: true
  has_many :bookmarks, dependent: :destroy
  has_many :recent_streams, dependent: :destroy
  has_many :downloads, dependent: :destroy
  has_many :plays, dependent: :destroy
  has_many :wrw_plays, dependent: :destroy
  belongs_to :audio, optional: true
  belongs_to :image, optional: true

  # nested attributes
  accepts_nested_attributes_for :image
  accepts_nested_attributes_for :audio

  # Validations
  validates :stream_count, numericality: { greater_than_or_equal_to: 0 }
  validates :play_date, :original_air_date, presence: true
  validates_uniqueness_of :rscuepisode_id, if: -> { paid }
  validates :rscuepisode_id, presence: true, if: -> { paid }

  # Scopes
  scope :available, ->{ where(available: true) }
  scope :recently_added, ->{ order("created_at DESC").first(10) }
  scope :featured, ->{ where(featured: true) }
  scope :with_series_id, ->(series_id){ joins(:series).where(series: {id: series_id}) }
  scope :search, ->(title) { joins(:series).where("series.title ILIKE ? OR episodes.title ILIKE ?", "%#{title}%", "%#{title}%") }
  scope :paid, ->{ where(paid: true) }
  scope :by_series, ->(series_id) { where(series_id: series_id) }
  scope :listing, ->{ where("DATE(play_date) <= ? AND episodes.available = ?", Date.today, true) }
  scope :free, ->{ where(paid: false) }
  scope :with_audio_episodes, ->{ where("audio_id IS NOT NULL") }
  scope :order_by_series_title, ->{joins(:series).order("series.title")}
  scope :order_by_air_date, ->{ order("original_air_date") }
  scope :order_by_series_title_and_air_date, ->{joins(:series).order("series.title asc", "episodes.original_air_date asc")}
  scope :order_by_featured, ->{ order("featured_at DESC") }
  scope :sort_by_play_date, ->{ where('play_date <= ?', Date.today)}
  scope :order_by_play_date, ->{ order("play_date DESC") }

  # Delegate
  delegate :title, to: :series, prefix: true

  after_update :update_cache
  before_save :set_featured_at, if: :featured_changed?

  # instance methods
  def artwork_url
    image_url = if self.paid
                  self.image.present? ? image.attachment.url(:api_response) : self.series.image&.attachment&.url(:api_response)
                else
                  Image.find_by_attachment("wrw_placeholder_image.jpg")&.attachment&.url
                end
    Cache.fetch "episode_artwork_url_#{self.id}" do
      Globalconstants.fetch_signed_url(image_url)
    end
  end

  # class methods
  class << self
    def when_radio_was(episode_play_dates)
      episodes = playable_episodes_with_date(episode_play_dates)
      get_episodes_with_date(episodes)
    end

    def get_episodes_with_date(episodes)
      episodes_arr = []
      episodes.each do |date, ep_arr|
        new_episodes_arr = []
        ep_arr.each do |episode|
          air_date = episode.original_air_date.to_date == Date.strptime('01/01/1900', '%m/%d/%Y') ? nil : episode.original_air_date
          new_episodes_arr << { id: episode.id, title: episode.title, original_air_date: air_date, series_title: episode.series_title, play_date: episode.play_date, series_description: episode.series_title }
        end
        episodes_arr << { title: date.to_date.strftime('%-m/%-d/%Y').to_s, duration: ep_arr.pluck(:duration), episode_ids: ep_arr.pluck(:id), data: new_episodes_arr }
      end
      episodes_arr
    end

    def most_popular
      self.available.paid.with_audio_episodes.where('episodes.stream_count > 0').order('stream_count DESC').first(Setting.popular_episodes_limit)
    end

    def free_playable_episode_ids
      hash = get_playable_episodes
      hash.values.flatten.uniq.pluck(:id)
    end

    def get_free_episodes_by_played_at(free_episodes)
      free_episode_hash = {}
      episodes = get_episodes_with_date(free_episodes.group_by(&:play_date))
      episodes.each do |episode|
        recent_play_date = RecentStream.joins(:episode).where('episodes.id IN (?)', episode[:episode_ids]).order('recent_streams.played_at desc').first.played_at
        free_episode_hash[recent_play_date] = episode
      end
      free_episode_hash
    end

    def get_paid_episodes_by_played_at(user, paid_episodes)
      paid_episode_hash = {}
      paid_episodes.each do |paid_episode|
        paid_episode_play_date = paid_episode.recent_streams.order("played_at DESC").first.played_at
        paid_episode_hash[paid_episode_play_date] = serialize_episodes(user, paid_episode)
      end
      paid_episode_hash
    end

    def get_playable_episodes
      hash = {}
      episodes =
        self.where("DATE(play_date) <= ? AND paid = ? AND available = ? AND audio_id IS NOT NULL", Date.today, false, true
          ).order('play_date desc').group_by{ |t| t.play_date.to_date}
      episodes.first(15).each do |key, values|
        hash["#{key}"] = values.first(Globalconstants::FREE_EPISODE_COUNT) if values.count > 0 && hash.keys.count < Globalconstants::FREE_EPISODE_COUNT
      end
      hash
    end

    def playable_episodes_with_date(episode_dates)
      episodes_hash = {}
      episodes = Episode.where('DATE(play_date) IN (?) AND paid = ? AND available = ? AND audio_id IS NOT NULL', episode_dates, false, true)
                        .order('play_date desc').group_by(&:play_date)
      episodes.keys.each do |date|
        if episodes[date].count.positive?
          episodes_hash[date.to_s] = episodes[date][0..2].sort_by(&:begin_duration)
        end
      end
      episodes_hash
    end

    def search_when_radio_was(search_string)
      search_episode_dates = Episode.free.available.with_audio_episodes.joins(:series).where("series.title ILIKE ? OR episodes.title ILIKE ?", "%#{search_string}%", "%#{search_string}%").group_by{ |ep| ep.play_date.to_date}.keys
      when_radio_was_arr = []
      if search_episode_dates.present?
        search_episode_dates.each do |play_date|
          new_episodes_arr = []
          episodes_arr = Episode.free.available.with_audio_episodes.where("DATE(play_date) = ? ", play_date)
          episodes_arr.each do |episode|
            air_date = episode.original_air_date.to_date == Date.strptime("01/01/1900", "%m/%d/%Y") ? nil : episode.original_air_date
            new_episodes_arr << {id: episode.id, title: episode.title, original_air_date: air_date, series_title: episode.series_title, play_date: episode.play_date, series_description: episode.series.title}
          end
          when_radio_was_arr << {title: "#{play_date.to_date.strftime("%-m/%-d/%Y")}", data: new_episodes_arr}
        end
      end
      when_radio_was_arr
    end

    def sort_by_order(sort_tag, episodes)
      return episodes.order('original_air_date asc') if sort_tag.blank?
      search_attribute = sort_tag.to_s.downcase
      if search_attribute == 'episode_title'
        episodes.order('title asc')
      elsif search_attribute == 'series_title'
        episodes.joins(:series).order_by_series_title
      else
        episodes.order("#{search_attribute} asc")
      end
    end

    def serialize_episodes(user, episodes)
      ActiveModelSerializers::SerializableResource.new(episodes, each_serializer: EpisodeSerializer, scope: {current_user: user, device_udid: nil, include_bookmark: nil, current_device: nil }).serializable_hash
    end
  end

  private
    def update_cache
      if self.image_id.present?
        Cache.rewrite_value "episode_artwork_url_#{self.id}" do
          Globalconstants.fetch_signed_url(self.image.attachment.url(:api_response))
        end
      else
        Cache.delete_key("episode_artwork_url_#{self.id}")
      end
      if self.audio_id.present?
        Cache.rewrite_value "episode_audio_url_#{self.id}" do
          Globalconstants.fetch_signed_url(self.audio.attachment_url)
        end
      else
        Cache.delete_key("episode_audio_url_#{self.id}")
      end
    end

    def set_featured_at
      self.featured_at = Time.now()
    end
end
