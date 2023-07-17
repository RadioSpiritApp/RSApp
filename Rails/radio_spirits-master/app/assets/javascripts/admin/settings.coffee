$(document).on 'turbolinks:load', ->
  $('.setting_manager_form').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'setting[value]':
        required: true
        integer: true
        min: 0
        max: 999999999
    messages:
      'setting[value]':
        required: 'Enter Value'
        integer: 'Enter a positive non-decimal number.'
        min: 'Enter a positive non-decimal number.'

  $('.home_page_content_form').on 'submit', ->
    if $('.home_page_sections:checked').length == 0
      $('#error_div').html 'Please select atleast one section'
      return false
    else
      $('#error_div').html ''
    return

  $('.copy_text_manager_form').validate
    errorElement: 'div'
    errorClass: 'field-error'
  $.validator.addClassRules 'setting-value',
    required: true
  $.validator.addClassRules 'max-30',
    maxlength: 30
  $.validator.addClassRules 'max-75',
    maxlength: 75
  $.validator.addClassRules 'max-150',
    maxlength: 150
  $.validator.addClassRules 'max-1000',
    maxlength: 1000
  $.validator.addClassRules 'max-50',
    maxlength: 50
  $.validator.addClassRules 'max-25',
    maxlength: 25
