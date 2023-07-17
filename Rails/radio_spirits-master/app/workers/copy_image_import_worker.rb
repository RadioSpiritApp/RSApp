class CopyImageImportWorker
  include Sidekiq::Worker

  def perform()
    image_files = %x(sshpass -p '#{$secret[:remote_password]}' ssh rsapp@66.246.245.76 ls  /rsappshare/images)
    image_create_count = 0
    image_files.split(' ').each do |image_filename|
      image = Image.find_by_attachment(image_filename)
      next if image_filename == '.' or image_filename == '..' or image.present?
      %x(sshpass -p '#{$secret[:remote_password]}' scp -r rsapp@66.246.245.76:/rsappshare/images/#{image_filename} public/#{image_filename})
      if File.exist?("public/#{image_filename}")
        image_file = File.open("public/#{image_filename}")
        Image.create(attachment: image_file)
        image_create_count += 1
        notification_msg = (image_create_count % 100 == 0) ? "#{image_create_count/100 * 100} image files are created." : " "
        Notification.create(notification_type: 'image_import', message: notification_msg) if notification_msg.present?
        FileUtils.rm_f("public/#{image_file}")
      end
    end
    notification_msg = image_files.blank? ? "No image files are present in remote server." : "Image files uploaded successfully."
    notification = Notification.create(notification_type: 'image_upload', message: notification_msg)
  end
end

