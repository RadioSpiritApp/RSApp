$(document).on 'turbolinks:load', ->
  $('.plan_form').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'plan[title]':
        required: true
      'plan[validity]':
        required: true
        integer: true
        min: 0
        max: 999999999
      'plan[amount]':
        required: true
        number: true
        min: 0
        max: 999999999999999
      'plan[itunes_id]':
        required: true
      'plan[play_store_id]':
        required: true
    messages:
      'plan[title]':
        required: 'Enter title'
      'plan[validity]':
        required: 'Enter number of days'
        integer: 'Enter a positive non-decimal number.'
        min: 'Enter a positive non-decimal number.'
      'plan[amount]':
        required: 'Enter amount'
      'plan[itunes_id]':
        required: 'Enter iTunes product id'
      'plan[play_store_id]':
        required: 'Enter play store product id'
