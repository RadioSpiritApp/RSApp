$(document).on 'turbolinks:load', ->
  $('.create_genre').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'genre[title]':
        required: true
      'genre[image_attributes][attachment]':
        minImageWidth: 700
        minImageHeight: 700
    messages:
      'genre[title]':
        required: 'Enter title'
