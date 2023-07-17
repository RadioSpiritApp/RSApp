$(document).on 'turbolinks:load', ->
  $('.edit-password').validate
    onkeyup: false
    onfocusout: (element) ->
      if !@checkable(element)
        @element element
    errorElement: 'div'
    errorClass: 'field-error'
    rules:
      'user[password]':
        required: true
        minlength: 3
      'user[password_confirmation]':
        required: true
        minlength: 3
        equalTo: ".new-password"
      'user[current_password]':
        required: true
    messages:
      'user[password]':
        required: "Enter new password"
        minlength: "Password should be minimum of 6 characters"
      'user[password_confirmation]':
        required: "Re-enter your new password"
        equalTo: "Password did not match"
      'user[current_password]':
        required: "Enter your current password"
