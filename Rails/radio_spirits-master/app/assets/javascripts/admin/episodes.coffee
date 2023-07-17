$(document).on 'turbolinks:load', ->
  $('.datepicker').datepicker()
  $('.create_episode').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'episode[title]':
        required: true
      'episode[begin_duration]':
        required: true
      'episode[end_duration]':
        required: true
      'episode[series_id]':
        required: true
      'episode[play_date]':
        required: true
      'episode[original_air_date]':
        required: true
      'episode[image_attributes][attachment]':
        accept: "image/jpeg, image/jpg, image/gif, image/png"
        minImageWidth: 700
        minImageHeight: 700
      'episode[audio_attributes][attachment]':
        accept: "audio/*"
      'episode[rscuepisode_id]':
        required: false
    messages:
      'episode[title]':
        required: 'Enter title'
      'episode[series_id]':
        required: 'Select series'
      'episode[play_date]':
        required: 'Select release date'
      'episode[original_air_date]':
        required: 'Select original air date'
      'episode[image_attributes][attachment]':
        accept: "Upload jpeg/jpg/png/gif format"
      'episode[audio_attributes][attachment]':
        accept: "Select mp3 format"
      'episode[rscuepisode_id]':
        required: 'Enter rscuepisode_id'  

  $('.create_episode').on 'change', '.ep_audio_input', ->
    sound = document.getElementById('sound')
    sound.src = if typeof(@files[0]) == 'undefined' then '' else URL.createObjectURL(@files[0])
    sound.onend = (e) ->
      URL.revokeObjectURL @src
      return

  $('.create_episode').on 'change', '#episode_paid', ->
    if $(this).val() == "true"
      $('.duration_inputs').hide()
    else
      $('.duration_inputs').show()
    return

  $('.create_episode').on 'change', '#episode_paid', ->
    if $('#episode_paid :selected').text() == "True"
      $("#episode_rscuepisode_id").rules("add", "required");
    else
      $("#episode_rscuepisode_id").rules("remove", "required");
    return

  if $('#episode_paid :selected').text() == "True"
    $("#episode_rscuepisode_id").rules("add", "required");
  else
    $("#episode_rscuepisode_id").rules("remove", "required");
  return