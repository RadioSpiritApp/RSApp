class DeltaImportWorker
  include Sidekiq::Worker
  require "mp3info"

  def perform()
    # For following command please run 'sudo apt-get install sshpass' on both staging and dev instance
    image_files = %x(sshpass -p '#{$secret[:remote_password]}' ssh rsapp@66.246.245.76 ls  /rsappshare/images)
    images = []
    image_files.split(' ').each do |image_filename|
      next if image_filename == '.' or image_filename == '..'
      %x(sshpass -p '#{$secret[:remote_password]}' scp -r rsapp@66.246.245.76:/rsappshare/images/#{image_filename} public/#{image_filename})
      image_file = File.open("public/#{image_filename}")
      images << {attachment: image_file, imageable_type: 'Episode'}
      FileUtils.rm_f("public/#{image_file}")
    end
    Image.create(images)

    audio_files = %x(sshpass -p '#{$secret[:remote_password]}' ssh rsapp@66.246.245.76 ls  /rsappshare/audios)
    audios = []
    audio_files.split(' ').each do |audio_filename|
      next if audio_filename == '.' or audio_filename == '..'
      %x(sshpass -p '#{$secret[:remote_password]}' scp -r rsapp@66.246.245.76:/rsappshare/audios/#{audio_filename} public/#{audio_filename})
      audio_file = File.open("public/#{audio_filename}")
      audio = Audio.where("attachment LIKE ?", "#{audio_filename}").first
      duration = nil
      Mp3Info.open(audio_file) do |mp3info|
        duration = mp3info.length
      end
      if audio.present? && (audio.duration != duration)
        audio.update(duration: duration, attachment: audio_file)
      elsif audio_file.present?
        audios << {attachment: audio_file, duration: duration}
      end
      FileUtils.rm_f("public/#{audio_filename}")
    end
    Audio.create(audios)

    csv_files = %x(sshpass -p '#{$secret[:remote_password]}' ssh rsapp@66.246.245.76 ls  /rsappshare/csvs)
    csv_files.split(' ').each do |csv_filename|
      next if csv_filename == '.' or csv_filename == '..'
      %x(sshpass -p '#{$secret[:remote_password]}' scp -r rsapp@66.246.245.76:/rsappshare/csvs/#{csv_filename} public/#{csv_filename})
      csv_file_path = "public/#{csv_filename}"
      begin
        csv_data = []
        spreadsheet = Roo::Spreadsheet.open(csv_file_path)
        header = spreadsheet.row(1)
        header = header.compact
        header.map!{|h| h.gsub(" ", "_").downcase}
        (2..spreadsheet.last_row).each do |i|
          row = Hash[[header, spreadsheet.row(i).first(header.size).each{|ele| ele.try(:strip!)}].transpose]
          csv_data << row
        end
      rescue Exception => exception
        puts "#{exception}"
      end
      if csv_data.present? && csv_filename == 'test_upload.xlsx'
        episode_error_hash = ::CsvUploader.create_episodes_by_data(csv_data)
        episode_error_hash.delete_if { |key, value| value.empty? }
        notification_message = episode_error_hash.empty? ? "Episodes are successfully imported from remote location" : "Please download error file to see error details occured during import from remote location"
        notification = Notification.new(notification_type: 'bulk_episode_upload', message: notification_message)
        unless episode_error_hash.empty?
          errors_file_path = CsvExporter.export_error_file(csv_file_path, episode_error_hash)
          notification.attachment = errors_file_path
        end
        notification.save
      elsif csv_data.present? && csv_filename == 'sample-series-upload.xlsx'
        series_error_hash = ::CsvUploader.create_series_by_data(csv_data)
        series_error_hash.delete_if { |key, value| value.empty? }
        notification_message = series_error_hash.empty? ? "Your series are successfully imported" : "The import process has been completed please download the file for details of series having errors"
        notification = Notification.new(notification_type: 'bulk_series_upload', message: notification_message)
        unless series_error_hash.empty?
          errors_csv_file_path = CsvExporter.export_error_file(csv_file_path, series_error_hash)
          notification.attachment = errors_csv_file_path
        end
        notification.save
      end
      FileUtils.rm_f(csv_file_path)
    end
  end
end
