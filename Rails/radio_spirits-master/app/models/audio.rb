class Audio < ApplicationRecord
  mount_uploader :attachment, AudioUploader
  has_many :episodes
  has_many :advertisements

  # Validations
  validates_presence_of :attachment

  after_update :update_duration
  before_destroy :unlink_associated_entities

  def cf_signed_url
    url = attachment_url
    if url.present?
      signer = AwsCfSigner.new($secret[:cf_private_key])
      url = url.gsub($secret[:s3_base_url], $secret[:cloudfront_url])
      signed_url = signer.sign(url, ending: Time.current + 600)
    end
    signed_url || ""
  end

  def remove_extention
    path_name_string = self.attachment.file.filename
    image_name = path_name_string.split(".")
    image_name.pop
    image_name.join('.')
  end

  def full_filename
    self&.attachment&.file&.filename
  end

  private

    def unlink_associated_entities
      Episode.where(audio_id: self.id).update_all(audio_id: nil)
      Advertisement.where(audio_id: self.id).update_all(audio_id: nil)
    end

    def update_duration
      Episode.where(audio_id: self.id).update_all(duration: self.duration)
      Advertisement.where(audio_id: self.id).update_all(duration: self.duration)
    end
end
