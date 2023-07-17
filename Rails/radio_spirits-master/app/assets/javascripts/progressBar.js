function startProgressBar() {
  $('.progress-bar').animate({
    width: '87%'
  }, 700);
};

function endProgressBar() {
  $('.progress-bar').stop();
  $('.progress-bar').animate({
    width: '100%'
  }, 100, function() {
    setTimeout(function() {
      $('.progress-bar').hide().width(0).show();
    }, 1000);
  });
}

$(document).ajaxSend(function() {
  startProgressBar();
});

$(document).ajaxComplete(function(event, xhr, settings){
  endProgressBar();
});

$(document).ajaxError(function (event, xhr, settings, thrownError) {
  iziToast.show({
    title: 'Warning',
    icon: 'fa fa-frown-o',
    message: xhr.responseText,
    color: 'red',
    position: 'bottomCenter',
  })
});
