class EpisodeUploaderWorker
  include Sidekiq::Worker
  require "mp3info"

  def perform(episode_id, audio_file_path, image_file_path)
    episode = Episode.find(episode_id)
    image_file = File.open(image_file_path) rescue nil
    if image_file.present?
       image = Image.new(attachment: image_file)
       if image.save
         episode.update(image_id: image.id)
       end
    end
    audio_file = File.open(audio_file_path) rescue nil
    if audio_file.present?
      audio_file_name = audio_file.path.split("/").last
      audio = Audio.where("attachment LIKE ?", "#{audio_file_name}").first
      audio = Audio.new(attachment: audio_file) if audio.nil?
      Mp3Info.open(audio_file_path) do |mp3info|
        duration = mp3info.length
      end
      audio.duration = duration
      if audio.save
        episode.update(audio_id: audio.id, duration: duration)
        Episode.free.where(title: episode.title, play_date: episode.play_date, series_id: episode.series.id).where.not(id: episode.id).update_all(audio_id: audio.id) unless episode.paid?
      end
    elsif !episode.paid?
      same_day_episode = Episode.free.where(title: episode.title, play_date: episode.play_date, series_id: episode.series.id).where.not(id: episode.id).first
      if same_day_episode.present?
        episode.audio_id = same_day_episode.audio_id
        episode.duration = same_day_episode.duration
      end
    end
    FileUtils.rm_rf("public/episode_#{episode_id}")
  end
end
