class CopyAudioImportWorker
  include Sidekiq::Worker
  require "mp3info"

  def perform()
    audio_files = %x(sshpass -p '#{$secret[:remote_password]}' ssh rsapp@66.246.245.76 ls  /rsappshare/audios)
    audio_create_count = 0
    audio_files.split(' ').each do |audio_filename|
      audio = Audio.where("attachment LIKE ?", "#{audio_filename}").first
      next if audio_filename == '.' or audio_filename == '..' or audio.present?
      %x(sshpass -p '#{$secret[:remote_password]}' scp -r rsapp@66.246.245.76:/rsappshare/audios/#{audio_filename} public/#{audio_filename})
      if File.exist?("public/#{audio_filename}")
        audio_file = File.open("public/#{audio_filename}")
        duration = nil
        Mp3Info.open(audio_file) do |mp3info|
          duration = mp3info.length
        end
        Audio.create(attachment: audio_file, duration: duration)
        audio_create_count += 1
        notification_msg = (audio_create_count % 100 == 0) ? "#{audio_create_count/100 * 100} audio files are created." : " "
        Notification.create(notification_type: 'audio_import', message: notification_msg) if notification_msg.present?
        FileUtils.rm_f("public/#{audio_filename}")
      end
    end
    notification_msg = audio_files.blank? ? "No Audio files are present in remote server." : "Audio files uploaded successfully."
    Notification.create(notification_type: 'audio_upload', message: notification_msg)
  end
end
