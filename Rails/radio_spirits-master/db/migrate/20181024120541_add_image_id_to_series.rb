class AddImageIdToSeries < ActiveRecord::Migration[5.2]
  def change
    add_column :series, :image_id, :integer

    Series.all.each do |series|
      linked_image = Image.where(imageable_type: 'Series', imageable_id: series.id).first
      series.update(image_id: linked_image.id) if linked_image.present?
    end
  end
end
