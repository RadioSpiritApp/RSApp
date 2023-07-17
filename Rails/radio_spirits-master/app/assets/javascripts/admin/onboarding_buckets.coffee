$(document).on 'turbolinks:load', ->
  $('.onboarding_bucket_form').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'onboarding_bucket[title]':
        required: true
      'onboarding_bucket[show_signup_after]':
        required: true
        integer: true
        min: 0
        max: 999999999
      'onboarding_bucket[skip_signup_for]':
        required: true
        integer: true
        min: 0
        max: 999999999
      'onboarding_bucket[weight]':
        required: true
        integer: true
        min: 1
        max: 999999999        
    messages:
      'onboarding_bucket[title]':
        required: 'Enter title'
      'onboarding_bucket[show_signup_after]':
        required: 'Enter number of days'
        integer: 'Enter a positive non-decimal number.'
        min: 'Enter a positive non-decimal number.'
      'onboarding_bucket[skip_signup_for]':
        required: 'Enter number of days'
        integer: 'Enter a positive non-decimal number.'
        min: 'Enter a positive non-decimal number.'
      'onboarding_bucket[weight]':
        required: 'Enter number of days'
        integer: 'Enter a positive non-decimal number greater than 0.'
        min: 'Enter a positive non-decimal number greater than 0.'