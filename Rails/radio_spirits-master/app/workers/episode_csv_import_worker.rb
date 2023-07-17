class EpisodeCsvImportWorker
  include Sidekiq::Worker

  def perform(spreadsheet_file_path)
    begin
      csv_data = []
      spreadsheet = Roo::Spreadsheet.open(spreadsheet_file_path)
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
    episode_error_hash = ::CsvUploader.create_episodes_by_data(csv_data)
    episode_error_hash.delete_if { |key, value| value.empty? }
    notification_message = episode_error_hash.empty? ? "Your episodes are successfully updated" : "The update process has been completed please download the file for details of episodes having errors"
    notification = Notification.new(notification_type: 'bulk_episode_upload', message: notification_message)
    unless episode_error_hash.empty?
      errors_csv_file_path = CsvExporter.export_error_file(spreadsheet_file_path, episode_error_hash)
      notification.attachment = errors_csv_file_path
    end
    notification.save
    File.delete(spreadsheet_file_path) if File.exist?(spreadsheet_file_path)
  end
end
