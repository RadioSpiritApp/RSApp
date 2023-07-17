$(document).on 'turbolinks:load', ->
  $('.unread').on 'click', ->
    if $(this).hasClass('unread')
      window.selectedNotfication = this.closest('li')
      notificationId = this.getAttribute('notificationid')
      $.ajax
        url: '/admin/read_notification/'
        beforeSend: (xhr) ->
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
        type: 'POST'
        dataType: 'json'
        data: {notification_id: notificationId}
        complete: (data) ->
          if data.responseJSON.success
            $(window.selectedNotfication).remove()
            updatedNotificationCount = parseInt($('.notification-count').text()) - 1
            if updatedNotificationCount == 0
              $('.notification-count').hide()
              $('.dropdown-alerts').html '<li><div>No notification available</div></li>'
            else
              $('.notification-count').text(updatedNotificationCount)
          window.selectedNotfication = null

  $('#notifications .dropdown-toggle').on 'click', (event) ->
    $(this).parent().toggleClass 'open'
    return

  $('html').click (evt) ->
    if !(evt.target.id == 'notifications') and !$(evt.target).closest('#notifications').length
      $('#notifications .dropdown').removeClass 'open'

