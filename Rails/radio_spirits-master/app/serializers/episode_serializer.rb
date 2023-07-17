class EpisodeSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :paid, :available, :featured,
             :stream_count, :duration, :play_date, :original_air_date,
             :series_id, :image_url, :url, :series_title, :advertisement,
             :artist, :artwork, :genres, :seek_time, :listened_before,
             :begin_duration, :end_duration, :series, :featured_at, :series_description

  def id
    object&.id.to_s
  end

  def image_url
    object&.artwork_url
  end

  def original_air_date
    object.original_air_date.to_date == Date.strptime("01/01/1900", "%m/%d/%Y") ? nil : object.original_air_date
  end

  def genres
    if object.paid?
      genres = object&.series.genres.order(:title)
    else
      genres = Genre.distinct.joins(:series).where("series.id IN (?)", Episode.where(play_date: object.play_date).pluck(:series_id)).order(:title)
    end
    ActiveModelSerializers::SerializableResource.new(genres, each_serializer: GenreSerializer,).serializable_hash
  end

  def url
    audio_url = object&.audio&.attachment_url
    cached_url = Cache.fetch "episode_audio_url_#{object&.id}" do
      Globalconstants.fetch_signed_url(audio_url)
    end
    CustomEncDec.encrypt(cached_url, scope[:device_udid]) if scope[:device_udid].present? && audio_url.present?
  end

  def advertisement
    ad = Advertisement.active.audio_list.with_audio.random.first
    AdvertisementSerializer.new(ad, scope:{device_udid: scope[:device_udid], episode_id: object&.id}) if ad.present?
  end

  def seek_time
    return 0 unless include_bookmark?
    
    bookmark = current_user&.bookmarks&.where(episode_id: object.id)&.first
    if bookmark.present?
      duration = bookmark&.episode&.duration
      seek_time = bookmark&.seek_time
      (duration - seek_time) <= 10 ? 0 : seek_time if duration.present? && seek_time.present?
    end
  end

  def attributes(*args)
    super.except(*attributes_to_remove)
  end

  def artist
    object&.series_title
  end

  def artwork
    image_url
  end

  def listened_before
    current_user.present? && current_user.recent_streams.pluck(:episode_id).include?(object&.id)
  end

  def series
    unless object.paid?
      serieses = Series.distinct.joins(:episodes).where("episodes.play_date = ? AND episodes.paid IS FALSE", object&.play_date).order(:title)
      series_with_paid_episode = []
      serieses.each do |series|
        series_with_paid_episode << series if series.episodes.paid.present?
      end
      ActiveModelSerializers::SerializableResource.new(series_with_paid_episode, each_serializer: SeriesSerializer,).serializable_hash
    end
  end

  def series_description
    object&.series&.description
  end

  private

    def attributes_to_remove
      # It will show advertisement for free user
      attributes_need_to_remove = []
      access_token = AccessToken.where(user_id: current_user.id, device_id: current_device.id).first if current_user.present? && current_device.present?
      attributes_need_to_remove << :advertisement if current_user.present? && access_token && current_user.has_active_subscription_on?(current_device&.device_type, access_token)
      attributes_need_to_remove << :seek_time unless include_bookmark?
      if object.paid?
        attributes_need_to_remove << :begin_duration
        attributes_need_to_remove << :end_duration
        attributes_need_to_remove << :series
      end
      attributes_need_to_remove << :series if object.series.episodes.paid.blank?
      return attributes_need_to_remove
    end

    def current_user
      scope.present? && scope[:current_user]
    end

    def current_device
      scope.present? && scope[:current_device]
    end

    def include_bookmark?
      scope.present? && scope[:include_bookmark]
    end
end
