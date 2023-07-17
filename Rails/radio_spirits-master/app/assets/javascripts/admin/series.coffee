$(document).on 'turbolinks:load', ->
  $('#series_genre_ids').select2()
  $(".create_series").validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'series[title]':
        required: true
      'series[genre_ids][]':
        required: true
      'series[image_attributes][attachment]':
        minImageWidth: 700
        minImageHeight: 700
    messages:
      'series[title]':
        required: 'Enter title'
      'series[genre_ids][]':
        required: "Please select genre"

