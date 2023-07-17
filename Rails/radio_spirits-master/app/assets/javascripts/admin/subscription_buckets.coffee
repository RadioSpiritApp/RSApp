$(document).on 'turbolinks:load', ->
  $("#subscription_bucket_plan_ids").select2()
  $('.subscription_bucket_form').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'subscription_bucket[title]':
        required: true
      'subscription_bucket[weight]':
        required: true
        integer: true
        min: 1
        max: 999999999    
    messages:
      'subscription_bucket[title]':
        required: 'Enter title'
      'subscription_bucket[weight]':
        required: 'Enter number of days'
        integer: 'Enter a positive non-decimal number greater than 0.'
        min: 'Enter a positive non-decimal number greater than 0.'        
