$(document).on 'change', 'input#episode-file-upload-field', (e) ->
  value = e.target.value
  if value.match(new RegExp('\\.(xlsx)$', 'i'))
    $('#file-upload-modal').modal 'hide'
    $('#progressPage').modal 'show'
    $('#upload_message_div').html 'Please wait, we are uploading your file.'
    upload_data = new FormData
    upload_data.append 'selected_file', $('input[type=file]')[0].files[0]
    $.ajax
      url: $('form#episodes_csv_upload_form').attr('action')
      beforeSend: (xhr) ->
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      type: 'POST'
      data: upload_data
      cache: false
      contentType: false
      processData: false
  else
    $('div.error_container').html('Please upload only xlsx files.').addClass('text-danger').show()
  return

$(document).on 'turbolinks:load', ->
  $('a#continue_to_upload_csv_form').on 'click', ->
    $('#episode-import-first-step').modal 'hide'
    $('#file-upload-modal').modal 'show'
    return
  $('a#go_to_first_import_page').on 'click', ->
    $('#file-upload-modal').modal 'hide'
    $('#episode-import-first-step').modal 'show'
    return
  $(document).on 'show.bs.modal', '#file-upload-modal', (e) ->
    $('form#episodes_csv_upload_form').trigger 'reset'
    $('div.error_container').html('').removeClass('text-danger').hide()
    return
  $(document).on 'show.bs.modal', '#progressPage', (e) ->
    elem = document.getElementById('episode_upload_progress_bar')
    width = 1
    id = setInterval(frame, 10)

    frame = ->
      if width >= 100
        clearInterval id
      else
        width++
        elem.style.width = width + '%'
      return

    return
  $(document).on 'click', 'a.see_full_error_link', (e) ->
    element = $(this)
    element.parent().parent().hide()
    element.parent().parent().siblings('div.full_error').show()
    return
  $(document).on 'click', 'a.see_less_error_link', (e) ->
    element = $(this)
    element.parent().parent().hide()
    element.parent().parent().siblings('div.truncated_error').show()
    return
  $('#series-import-first-step').on 'click', '#continue_to_upload_series_csv', ->
    $('#series-import-first-step').modal 'hide'
    $('#series-import-form').modal 'show'
    return

  $(document).on 'change', 'input#series-file-upload-field', (e) ->
    value = e.target.value
    if value.match(new RegExp('\\.(xlsx)$', 'i'))
      $('#series-import-form').modal 'hide'
      $('#progressPage').modal 'show'
      $('#upload_message_div').html 'Please wait, we are uploading your file.'
      $('form#series_csv_upload_form').submit()
    else
      $('div.error_container').html('Please upload only xlsx files.').addClass('text-danger').show()
    return
  return
