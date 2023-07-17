$(document).on 'turbolinks:load', ->
  $(document).on 'change', 'input#bulk_images_upload_field', (e) ->
    value = e.target.value
    status = []
    image_status = []
    invalid_files = ''
    invalid_files_count = 0
    all_files = e.target.files
    _URL = window.URL || window.webkitURL
    $(all_files).each (index) ->
      filename = $(this)[0].name
      img = new Image
      img.onload = ->
        if @width < 700 || @height < 700 
          status.push false
          invalid_files += ' ' + filename
          invalid_files_count++
        else
          status.push "image_true"
        check_validation(all_files, status, invalid_files_count, invalid_files)
      img.src = _URL.createObjectURL(this)
      if !/\.(gif|jpg|jpeg|tif|png|eps|bmp)$/i.test(filename.toLowerCase())
        status.push false
        invalid_files += ' ' + filename
        invalid_files_count++
      else
        status.push true
      check_validation(all_files, status, invalid_files_count, invalid_files)


check_validation =(all_files, status, invalid_files_count, invalid_files) ->
  if all_files.length == 0
    $('div.error_container').html('Please select files to upload.').addClass('text-danger').show()
    $('span#files_count').removeClass('text-success-msg').hide()
    $('#images_file_upload').val 'Upload'
    $('#images_file_upload').hide()
  else if all_files.length > 50
    $('div.error_container').html('You can upload 50 files at max in single request.').addClass('text-danger').show()
    $('span#files_count').removeClass('text-success-msg').hide()
    $('#images_file_upload').val 'Upload'
    $('#images_file_upload').hide()
  else if ($.inArray(false, status) > -1)
    $('div.error_container').html('You have choose invalid files. Please fix' + invalid_files + ' file(s)').addClass('text-danger').show()
    $('span#files_count').removeClass('text-success-msg').hide()
    $('#images_file_upload').val 'Upload'
    $('#images_file_upload').hide()
  else if !($.inArray(false, status) > -1) 
    $('div.error_container').removeClass('text-danger').hide()
    $('span#files_count').html(all_files.length - invalid_files_count + ' file(s) will get uploaded.').addClass('text-success-msg').show()
    $('#images_file_upload').val 'Upload'
    $('#images_file_upload').show()
  return




