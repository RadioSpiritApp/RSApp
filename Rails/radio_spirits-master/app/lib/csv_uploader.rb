module CsvUploader
  require "activerecord-import"

  def self.create_episodes_by_data(csv_data)
    episode_error_hash = {}
    begin
      ActiveRecord::Base.transaction do
        csv_data.each_with_index do |row, index|
          row_hash = row.to_hash
          episode_error_hash["#{index + 2}"] = []
          episode_error_hash["#{index + 2}"] << 'paid not present' if row_hash["paid*"].nil?
          episode_error_hash["#{index + 2}"] << 'title not present' if row_hash["title*"].nil?
          episode_error_hash["#{index + 2}"] << 'available not present' if row_hash["available*"].nil?
          episode_error_hash["#{index + 2}"] << 'featured not present' if row_hash["featured*"].nil?
          episode_error_hash["#{index + 2}"] << 'play date not present' if row_hash["play_date*"].nil?
          episode_error_hash["#{index + 2}"] << 'original air date not present' if row_hash["original_air_date*"].nil?
          episode_error_hash["#{index + 2}"] << 'Enter Series ID or RV Series ID' if row_hash["series_id"].nil? && row_hash["rv_series_id"].nil?
          episode_error_hash["#{index + 2}"] << 'Rscuepisode ID not present' if row_hash["rscuepisode_id"].nil? && row_hash["paid*"].to_s.downcase == "true"
          if row_hash["paid*"].present?
            episode_error_hash["#{index + 2}"] << 'Invalid Paid type' if !(row_hash["paid*"].to_s.downcase == "true" || row_hash["paid*"].to_s.downcase == "false")
            if row_hash["paid*"].to_s.downcase == "false"
              episode_error_hash["#{index + 2}"] << 'Enter begin time' if (row_hash["begin_time"].nil?)
              episode_error_hash["#{index + 2}"] << 'Enter end time' if (row_hash["end_time"].nil?)

            end
          end
          if row_hash["available*"].present?
            episode_error_hash["#{index + 2}"] << 'Invalid Available type' if !(row_hash["available*"].to_s.downcase == "true" || row_hash["available*"].to_s.downcase == "false")
          end
          if row_hash["featured*"].present?
            episode_error_hash["#{index + 2}"] << 'Invalid Featured type'  if !(row_hash["featured*"].to_s.downcase == "true" || row_hash["featured*"].to_s.downcase == "false")
          end
          if row_hash["rv_series_id"].present?
            series = Series.where(rv_series_id: row_hash["rv_series_id"]).first
          end

          if series.nil? && row_hash["series_id"].present?
            series = Series.where(id: row_hash["series_id"]).first
          end
          episode_error_hash["#{index + 2}"] << "Series with given Series ID or RV Series ID is not available"  if series.nil? && (row_hash["series_id"].present? || row_hash["rv_series_id"].present?)

          if row_hash["play_date*"].present?
            if row_hash["play_date*"].is_a? Date
              play_date = row_hash["play_date*"]
            else
              play_date = Date.strptime(row_hash["play_date*"], "%m/%d/%Y") rescue nil
            end
            episode_error_hash["#{index + 2}"] << "Invalid play date(must follow mm/dd/yyyy format)" if play_date.nil?
          end
          if row_hash["audio_file_name"].present?
            audio_file_name = row_hash["audio_file_name"]
            audio_file_name = audio_file_name.to_s.strip
            audio = Audio.where("attachment LIKE ?", "#{audio_file_name}").first
            episode_error_hash["#{index + 2}"] << "Audio file not present with name #{audio_file_name}" if audio.nil?
          elsif row_hash["paid*"].to_s.downcase == "false" && play_date.present?
            audio = Episode.where(title: row_hash["title*"], play_date: play_date, paid: false, series_id: series.id).last&.audio
          end
          if row_hash["image_file_name"].present?
            image_file_name = row_hash["image_file_name"].to_s
            image_file_name = image_file_name.to_s.strip
            image = Image.where("attachment LIKE ? ", "#{image_file_name}").first
            episode_error_hash["#{index + 2}"] << "Image file not present with name #{image_file_name}" if image.nil?
          end
          if row_hash["original_air_date*"].present?
            if row_hash["original_air_date*"].is_a? Date
              original_air_date = row_hash["original_air_date*"]
            else
              original_air_date = Date.strptime(row_hash["original_air_date*"], "%m/%d/%Y") rescue nil
            end
            episode_error_hash["#{index + 2}"] << "Invalid original air date(must follow mm/dd/yyyy format)" if original_air_date.nil?
          end
          if episode_error_hash["#{index + 2}"].blank?
            begin_time, end_time = nil, nil

            if row_hash["begin_time"].present?
              begin_time_arr = row_hash["begin_time"].to_s.split(":")
              begin_time = (begin_time_arr.first.to_i * 3600 + begin_time_arr.second.to_i * 60 + begin_time_arr.last.to_i) rescue nil
            end

            if row_hash["end_time"].present?
              end_time_arr = row_hash["end_time"].to_s.split(":")
              end_time = (end_time_arr.first.to_i * 3600 + end_time_arr.second.to_i * 60 + end_time_arr.last.to_i) rescue nil
            end
            episode = Episode.new(paid: row_hash["paid*"].to_boolean,
              title: row_hash["title*"],
              description: row_hash["description*"],
              available: row_hash["available*"],
              featured: row_hash["featured*"],
              play_date: play_date,
              original_air_date: original_air_date,
              series_id: series.id,
              rscuepisode_id: row_hash["rscuepisode_id"],
              begin_duration: begin_time,
              end_duration: end_time
            )
            if audio.present?
              episode.audio_id = audio.id
              episode.duration = audio.duration
            elsif (!episode.paid?)
              same_day_episode = Episode.where(title: row_hash["title*"], play_date: play_date, paid: false, series_id: series.id).first
              if same_day_episode.present?
                episode.audio_id = same_day_episode.audio_id
                episode.duration = same_day_episode.duration
              end
            end
            episode.image_id = image.id if image.present?
            if episode.valid?
              if episode.save
                Episode.where(title: row_hash["title*"], play_date: play_date, paid: false, series_id: series.id).where.not(id: episode.id).update_all(audio_id: audio.id) if ((!episode.paid?) && audio.present?)
              end
            else
              episode.errors.full_messages.each do |er|
                episode_error_hash["#{index + 2}"] << er
              end
            end
          end
        end
      end
    rescue Exception => exception
      puts "You have uploaded a faulty csv. Please fix it and try again."
      puts exception
      puts "=============================================="
      puts exception.backtrace
    end
    episode_error_hash
  end

  def self.create_series_by_data(csv_data)
    series_error_hash = {}
    begin
      ActiveRecord::Base.transaction do
        csv_data.each_with_index do |row, index|
          row_hash = row.to_hash
          series_error_hash["#{index + 2}"] = []
          if row_hash["genre_id*"].to_s.split("\n").blank?
            series_error_hash["#{index + 2}"] << "Genre can't be blank"
          end
          if row_hash["available*"].nil?
            series_error_hash["#{index + 2}"] << "Available can't be blank"
          elsif (not ["true", "false"].include?(row_hash["available*"].to_s.downcase))
            series_error_hash["#{index + 2}"] << "Invalid value for available"
          end
          if row_hash["featured*"].nil?
            series_error_hash["#{index + 2}"] << "Featured can't be blank"
          elsif (not ["true", "false"].include?(row_hash["featured*"].to_s.downcase))
            series_error_hash["#{index + 2}"] << "Invalid value for featured"
          end
          genres = Genre.where(id: row_hash["genre_id*"].to_s.split("\n"), available: true)
          if genres.blank? && series_error_hash["#{index + 2}"].blank?
            series_error_hash["#{index + 2}"] << "Genre with given id is unavailable or suspended"
          end
          if row_hash["image_file_name"].present?
            image_file_name = row_hash["image_file_name"].to_s
            image_file_name = image_file_name.to_s.strip
            image = Image.where("attachment LIKE ? ", "#{image_file_name}").first
            series_error_hash["#{index + 2}"] << "Image file not present with name #{image_file_name}" if image.blank?
          end
          series = Series.new(title: row_hash["title*"])
          series.description = row_hash["description"]
          series.available = row_hash["available*"].to_boolean
          series.featured = row_hash["featured*"].to_boolean
          series.image_id = image.id if image.present?
          series.rv_series_id = row_hash["rv_series_id"]
          if series.valid? && series_error_hash["#{index + 2}"].blank?
            if series.save
              genres.each do |genre|
                GenreSeries.create(series_id: series.id, genre_id: genre.id)
              end
            end
          else
            series.errors.full_messages.each do |err_msg|
              series_error_hash["#{index + 2}"] << err_msg
            end
          end
        end
      end
    rescue Exception => exception
      puts "You have uploaded a faulty csv. Please fix it and try again."
      puts exception
      puts "=============================================="
      puts exception.backtrace
    end
    series_error_hash
  end
end
