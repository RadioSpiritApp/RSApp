class AddImageIdToGenres < ActiveRecord::Migration[5.2]
  def change
    add_column :genres, :image_id, :integer

    Genre.all.each do |genre|
      linked_image = Image.where(imageable_type: 'Genre', imageable_id: genre.id).first
      genre.update(image_id: linked_image.id) if linked_image.present?
    end
  end
end
