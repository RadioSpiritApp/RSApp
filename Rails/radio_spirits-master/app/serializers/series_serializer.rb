class SeriesSerializer < ActiveModel::Serializer
 attributes :id, :title, :description, :available, :featured, :image_url, :episode_count, :featured_at, :series_description
  has_many :genres

  def image_url
    object&.artwork_url
  end

  def episode_count
    # object.episodes.count
    object.episodes_count
  end

  def series_description
    object&.description
  end
end