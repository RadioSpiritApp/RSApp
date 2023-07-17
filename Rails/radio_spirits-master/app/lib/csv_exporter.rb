module CsvExporter
  require 'csv'

  def self.image_export_headers
    ['Index', 'File Name', 'Image URL']
  end

  def self.audio_export_headers
    ['Index', 'File Name', 'Audio URL']
  end

  def self.export_error_file(upload_file_path, error_hash)
    FileUtils::mkdir_p "public/episodes_error_files/"
    file_path = Rails.root.join("public", "episodes_error_files", "episodes_errors_#{Time.current}.xlsx").to_path
    spreadsheet = Roo::Spreadsheet.open(upload_file_path)
    first_row = spreadsheet.row(1)
    first_row.unshift("Errors") unless first_row.include?("Errors")
    #spreadsheet.client_encoding = 'UTF-8'
    xlsx_package = Axlsx::Package.new
    wb = xlsx_package.workbook
    wb.add_worksheet(name: "Sheet1") do |sheet|
      sheet.add_row(first_row)
      error_hash.each do |row_id, errors_array|
        errors_array.uniq!
        row_data = spreadsheet.row(row_id.to_i)
        if spreadsheet.row(1).include?("Errors")
          row_data[0] = errors_array.join(", ")
        else
          row_data.unshift(errors_array.join(", "))
        end
        sheet.add_row(row_data)
      end
    end
    xlsx_package.serialize file_path
    file_path
  end
end
