$(document).on 'turbolinks:load', ->
  $('.ad_manager_form').on 'change', '#advertisement_ad_type', ->
    ad_type = $(this).val()
    if ad_type == 'image'
      $('.image_upload').show()
      $('.audio_upload').hide()
      $('.audio_file_name').hide()
      $('#advertisement_image_attributes_attachment').addClass('upload_selected_image_or_audio')
      $('#advertisement_audio_attributes_attachment').removeClass('upload_selected_image_or_audio')
      $('.image_file_name').show()
      $('#advertisement_audio_attributes_attachment').val("")

    else if ad_type == 'audio'
      $('.image_upload').hide()
      $('.audio_upload').show()
      $('.audio_file_name').show()
      $('.image_file_name').hide()
      $('#advertisement_audio_attributes_attachment').addClass('upload_selected_image_or_audio')
      $('#advertisement_image_attributes_attachment').removeClass('upload_selected_image_or_audio')
      $("#advertisement_image_attributes_attachment").val("")
    else
      $('.image_upload').hide()
      $('.audio_upload').hide()
      $('.audio_file_name').hide()
    return
  $('.ad_manager_form').on 'change', '.ad_audio_input', ->
    sound = document.getElementById('sound')
    sound.src = if typeof(@files[0]) == 'undefined' then '' else URL.createObjectURL(@files[0])
    sound.onend = (e) ->
      URL.revokeObjectURL @src
      return

  $('.ad_manager_form').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'advertisement[title]':
        required: true
        maxlength: 100
      'advertisement[ad_type]':
        required: true
      'advertisement[redirect_url]':
        required: true,
        url: true
      'advertisement[image_attributes][attachment]':
        image_file: true,
        accept: "image/jpeg, image/jpg, image/gif, image/png"
        minImageWidth: 1120
        minImageHeight: 280
      'advertisement[audio_attributes][attachment]':
        audio_file: true,
        accept: "audio/*",
        extension: "mp3"
    messages:
      'advertisement[title]':
        required: 'Enter title'
        maxlength: 'Title limit exceeds'
      'advertisement[ad_type]':
        required: 'Select type'
      'advertisement[redirect_url]':
        required: 'Enter an URL',
        url: 'Enter a valid URL'
      'advertisement[image_attributes][attachment]':
        accept: "Upload jpeg/jpg/png/gif format"
      'advertisement[audio_attributes][attachment]':
        accept: "Select mp3 format"
