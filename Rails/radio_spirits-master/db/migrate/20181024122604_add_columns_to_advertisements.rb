class AddColumnsToAdvertisements < ActiveRecord::Migration[5.2]
  def change
    add_column :advertisements, :image_id, :integer
    add_column :advertisements, :audio_id, :integer


    Advertisement.all.each do |adv|
      linked_audio = Audio.where(audible_type: 'Advertisement', audible_id: adv.id).first
      adv.update(audio_id: linked_audio.id) if linked_audio.present?

      linked_image = Image.where(imageable_type: 'Advertisement', imageable_id: adv.id).first
      adv.update(image_id: linked_image.id) if linked_image.present?
    end
  end
end
