class ImageUploadWorker
  include Sidekiq::Worker

  def perform(images_path_array, parent_folder)
    images = []
    images_path_array.each do |image_file_path|
      image_file = File.open(image_file_path) rescue nil
      if image_file.present?
        images << {attachment: image_file, imageable_type: 'Episode'}
      end
    end
    Image.create(images)
    FileUtils.rm_rf("public/bulk_images/#{parent_folder}")
  end
end
