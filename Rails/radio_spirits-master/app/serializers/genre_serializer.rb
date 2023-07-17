class GenreSerializer < ActiveModel::Serializer
 attributes :id, :title, :available, :image_url

  def image_url
    object&.artwork_url
  end
end

