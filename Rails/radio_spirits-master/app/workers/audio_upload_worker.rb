class AudioUploadWorker
  include Sidekiq::Worker
  require "mp3info"

  def perform(audios_path_array, parent_folder)
    audios = []
    audios_path_array.each do |audio_file_path|
      duration = nil
      audio_file = File.open(audio_file_path) rescue nil
      audio_file_name = audio_file.path.split("/").last
      audio = Audio.where("attachment LIKE ?", "#{audio_file_name}").first
      Mp3Info.open(audio_file_path) do |mp3info|
        duration = mp3info.length
      end
      if audio.present? && (audio.duration != duration)
        audio.update(duration: duration, attachment: audio_file)
      elsif audio_file.present?
        audios << {attachment: audio_file, duration: duration}
      end
    end
    Audio.create(audios)
    FileUtils.rm_rf("public/bulk_audios/#{parent_folder}")
  end
end
