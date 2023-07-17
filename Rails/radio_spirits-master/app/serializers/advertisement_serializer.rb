class AdvertisementSerializer < ActiveModel::Serializer
  attributes :id, :title, :ad_type, :redirect_url, :image_url, :url, :artist, :duration, :artwork

  def id
    object&.id.to_s
  end

  def image_url
    Cache.fetch "advertisement_artwork_url_#{object&.id}" do
      Globalconstants.fetch_signed_url(object&.image&.attachment_url(:ad_banner))
    end
  end

  def url
    audio_url = object&.audio&.attachment_url
    cached_url = Cache.fetch "advertisement_audio_url_#{object&.id}" do
      Globalconstants.fetch_signed_url(audio_url)
    end
    CustomEncDec.encrypt(cached_url, scope[:device_udid]) if scope.present? && scope[:device_udid].present?
  end

  def artist
    object.title
  end

  def artwork
    episode = Episode.find(scope[:episode_id]) if scope.present? && scope[:episode_id].present?
    episode.present? ? episode.artwork_url : ""
  end

  def attributes(*args)
    super.except(*attributes_to_remove)
  end


  private

    def attributes_to_remove
      # It will show advertisement for free user
      return [:audio_url] if object&.ad_type == "image"
      return [:image_url] if object&.ad_type == "audio"
    end
end
