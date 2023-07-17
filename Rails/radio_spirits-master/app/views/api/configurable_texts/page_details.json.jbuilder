json.success true
json.message "Configurable Texts fetched successfully"
@copy_texts.each do |page_name, parameters|
  json.set! page_name do
    parameters.each do |parameter|
      json.set! parameter.key, parameter.value
    end
  end
end
json.download_limit @download_limit.to_i
