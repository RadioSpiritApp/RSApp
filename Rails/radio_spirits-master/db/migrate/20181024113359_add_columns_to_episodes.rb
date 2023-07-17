class AddColumnsToEpisodes < ActiveRecord::Migration[5.2]
  def change
    add_column :episodes, :audio_id, :integer
    add_column :episodes, :image_id, :integer
    add_column :episodes, :begin_duration, :integer
    add_column :episodes, :end_duration, :integer
    Episode.all.each do |ep|
      linked_audio = Audio.where(audible_type: 'Episode', audible_id: ep.id).first
      ep.update(audio_id: linked_audio.id) if linked_audio.present?

      linked_image = Image.where(imageable_type: 'Episode', imageable_id: ep.id).first
      ep.update(image_id: linked_image.id) if linked_image.present?
    end
  end
end
