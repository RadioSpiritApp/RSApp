$(document).on 'turbolinks:load', ->
  $(document).on 'change', 'input#bulk_audios_upload_field', (e) ->
    value = e.target.value
    status = []
    invalid_files = ''
    invalid_files_count = 0
    all_files = e.target.files
    $(all_files).each (index) ->
      filename = $(this)[0].name
      if !/\.(mp3|mp4)$/i.test(filename.toLowerCase())
        status.push false
        invalid_files += ' ' + filename
        invalid_files_count++
      else
        status.push true
      return
    if all_files.length == 0
      $('div.error_container').html('Please select files to upload.').addClass('text-danger').show()
      $('span#files_count').removeClass('text-success-msg').hide()
      $('#audios_file_upload').val 'Upload'
      $('#audios_file_upload').hide()
    else if all_files.length > 50
      $('div.error_container').html('You can upload 50 files at max in single request.').addClass('text-danger').show()
      $('span#files_count').removeClass('text-success-msg').hide()
      $('#audios_file_upload').val 'Upload'
      $('#audios_file_upload').hide()
    else if !($.inArray(true, status) > -1)
      $('div.error_container').html('You have choose invalid files. Please fix' + invalid_files + ' file(s)').addClass('text-danger').show()
      $('span#files_count').removeClass('text-success-msg').hide()
      $('#audios_file_upload').val 'Upload'
      $('#audios_file_upload').hide()
    else if $.inArray(false, status) > -1 and $.inArray(true, status) > -1
      $('div.error_container').html('There are ' + invalid_files_count + '(' + invalid_files + ')' + ' invalid file(s).').addClass('text-danger').show()
      $('span#files_count').html(all_files.length - invalid_files_count + ' file(s) will get uploaded.').addClass('text-success-msg').show()
      $('#audios_file_upload').val 'Skip invalid and continue'
      $('#audios_file_upload').show()
    else if !($.inArray(false, status) > -1)
      $('div.error_container').removeClass('text-danger').hide()
      $('span#files_count').html(all_files.length - invalid_files_count + ' file(s) will get uploaded.').addClass('text-success-msg').show()
      $('#audios_file_upload').val 'Upload'
      $('#audios_file_upload').show()
    return
