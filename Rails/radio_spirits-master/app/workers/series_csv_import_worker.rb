class SeriesCsvImportWorker
  include Sidekiq::Worker

  def perform(csv_file_path)
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
    series_error_hash = ::CsvUploader.create_series_by_data(csv_data)
    series_error_hash.delete_if { |key, value| value.empty? }
    notification_message = series_error_hash.empty? ? "Your series are successfully imported" : "The import process has been completed please download the file for details of series having errors"
    notification = Notification.new(notification_type: 'bulk_series_upload', message: notification_message)
    unless series_error_hash.empty?
      errors_csv_file_path = CsvExporter.export_error_file(csv_file_path, series_error_hash)
      notification.attachment = errors_csv_file_path
    end
    notification.save
    File.delete(csv_file_path) if File.exist?(csv_file_path)
  end
end
