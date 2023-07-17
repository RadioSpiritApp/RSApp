class Genre < ApplicationRecord

  # Validations
  validates :title, presence: true, uniqueness: { case_sensitive: false }

  # Associations
  has_many :genre_series, dependent: :destroy
  has_many :series, through: :genre_series
  belongs_to :image, optional: true

  # Nested attributes
  accepts_nested_attributes_for :image

  # Scopes
  scope :available, ->{where(available: true).order(:title)}
  scope :search, ->(title) { where("title ILIKE ?", "%#{title}%") }
  scope :with_series, ->{joins(:series).distinct}
  scope :order_by_id, ->{order("id ASC")}

  after_update :update_cache

  def artwork_url
    Cache.fetch "genre_artwork_url_#{self.id}" do
      Globalconstants.fetch_signed_url(image&.attachment&.url(:api_response))
    end
  end

  private
    def update_cache
      if self.image_id.present?
        Cache.rewrite_value "genre_artwork_url_#{self.id}" do
          Globalconstants.fetch_signed_url(self.image.attachment.url(:api_response))
        end
      else
        Cache.delete_key("genre_artwork_url_#{self.id}")
      end
    end
end
