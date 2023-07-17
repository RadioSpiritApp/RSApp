class Image < ApplicationRecord
  mount_uploader :attachment, ImageUploader
  has_many :episodes
  has_many :advertisements
  has_many :series
  has_many :genres

  # Validations
  validates_presence_of :attachment

  before_destroy :unlink_associated_entities

  ACCEPTED_FORMATES = ['.png', '.jpg', '.jpeg', '.gif', '.tif', '.eps']

  def remove_extention
  	path_name_string = self.attachment.file.filename
    image_name = path_name_string.split(".")
    image_name.pop
    image_name.join('.')
  end

  def cf_signed_url(version=nil)
    url = version.present? ? attachment_url(version.to_sym) : attachment_url
    if url.present?
      signer = AwsCfSigner.new($secret[:cf_private_key])
      url = url.gsub($secret[:s3_base_url], $secret[:cloudfront_url])
      signed_url = signer.sign(url, ending: Time.current + 600)
    end
    signed_url || ""
  end

  def full_filename
    self&.attachment&.file&.filename
  end

  private

    def unlink_associated_entities
      Episode.where(image_id: self.id).update_all(image_id: nil)
      Advertisement.where(image_id: self.id).update_all(image_id: nil)
      Series.where(image_id: self.id).update_all(image_id: nil)
      Genre.where(image_id: self.id).update_all(image_id: nil)
    end
end
