class Series < ApplicationRecord
  # Associations
  has_many :genre_series, dependent: :destroy
  has_many :genres, through: :genre_series
  has_many :episodes, dependent: :destroy
  belongs_to :image, optional: true

  # Nested attributes
  accepts_nested_attributes_for :image
  accepts_nested_attributes_for :genres
  accepts_nested_attributes_for :genre_series

  # Validations
  validates :title, presence: true, uniqueness: { case_sensitive: false }
  validates :rv_series_id, uniqueness: true, if: Proc.new { |series| series.rv_series_id.present? }
  validates :rv_series_id, numericality: { only_integer: true }, if: Proc.new { |series| series.rv_series_id.present? }

  # Scopes
  scope :available, -> { where(available: true).order(:title) }
  scope :featured, -> { where(featured: true) }
  scope :search, ->(title) { where('series.title ILIKE ?', "%#{title}%") }
  scope :with_genre_id, ->(genre_id){ joins(:genres).where(genres: { id: genre_id }) }
  scope :with_episodes, -> { joins(:episodes).where('episodes.paid = ?', true).distinct }
  scope :order_by_featured, -> { reorder('featured_at DESC') }

  # Callbacks
  after_update :update_cache
  before_save :set_featured_at, if: :featured_changed?

  def self.most_popular
    self.joins(:episodes).select("series.*,
      SUM(episodes.stream_count)/episodes.count AS average_streams"
      ).group('series.id').where('episodes.stream_count > 0').order('average_streams').available.first(Setting.popular_series_limit)
  end

  def artwork_url
    Cache.fetch "series_artwork_url_#{self.id}" do
      Globalconstants.fetch_signed_url(image&.attachment&.url(:api_response))
    end
  end

  private

  def update_cache
    if self.image_id.present?
      Cache.rewrite_value "series_artwork_url_#{self.id}" do
        Globalconstants.fetch_signed_url(self.image.attachment.url(:api_response))
      end
    else
      Cache.delete_key("series_artwork_url_#{self.id}")
    end
  end

  def set_featured_at
    self.featured_at = Time.now()
  end
end
