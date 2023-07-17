class Advertisement < ApplicationRecord
  # associations
  belongs_to :audio, optional: true
  belongs_to :image, optional: true

  # nested_attributes
  accepts_nested_attributes_for :image
  accepts_nested_attributes_for :audio

  # validations
  validates :title, presence: true, length: { maximum: 100 }
  validates :ad_type, presence: true

  # scopes
  scope :active, -> { where(active: true) }
  scope :with_audio, -> {where.not(audio_id: nil)}
  scope :random, -> { order(Arel.sql('random()')) }
  scope :audio_list, ->{where(ad_type: "audio")}
  scope :image_list, ->{where(ad_type: "image").where.not(image_id: nil)}
  scope :search, ->(title) { where("title ILIKE ?", "%#{title}%") }

  after_update :update_cache

  def update_content
    if ad_type == "image"
      audio.destroy if audio.present?
    elsif ad_type == "audio"
      image.destroy if image.present?
    end
  end

  def duration
    self&.audio&.duration
  end

  private
    def update_cache
      if self.image_id.present?
        Cache.rewrite_value "advertisement_artwork_url_#{self.id}" do
          Globalconstants.fetch_signed_url(self.image.attachment.url(:api_response))
        end
      else
        Cache.delete_key("advertisement_artwork_url_#{self.id}")
      end

      if self.audio_id.present?
        Cache.rewrite_value "advertisement_audio_url_#{self.id}" do
          Globalconstants.fetch_signed_url(self.audio.attachment_url)
        end
      else
        Cache.delete_key("advertisement_audio_url_#{self.id}")
      end
    end
end
