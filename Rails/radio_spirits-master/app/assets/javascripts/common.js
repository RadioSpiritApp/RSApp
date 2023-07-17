$(document).on('turbolinks:load', function() {
  $(document).on('keypress', 'input.number', function(e){
    if (e.which != 0 && e.which != 8 && e.which != 9 && e.which != 39 && e.which != 46 && (e.which < 48 || e.which > 57)) {
      return false;
    }
  });

  $(document).on('keypress', 'input.digit', function(e){
    if (e.which != 8 && e.which != 9 && e.which != 39 && (e.which < 48 || e.which > 57)) {
      return false;
    }
  });

  setTimeout(function(){
    $('.flash_messages_div').slideUp('slow');
  }, 4000);

  $.validator.addMethod('audio_file', (function(value, element) {
    var audio_src = '';
    if (typeof($(".audio_file_name").find('#sound').attr('src')) != 'undefined'){
      audio_src = $(".audio_file_name").find('#sound').attr('src');
    }
    return (audio_src.length > 1);
  }), 'Select audio file');

  $.validator.addMethod('image_file', (function(value, element) {
    return (value.length > 0) || ($(".image_file_name").html().length > 1);
  }), 'Select image file');

  $.validator.addMethod('minImageWidth', function(value, element, minWidth) {
    if (typeof($(element).data('imageWidth')) == 'undefined'){
      return true
    }
    return ($(element).data('imageWidth') || 0) >= minWidth;
  }, function(minWidth, element) {
    var imageWidth = $(element).data('imageWidth');
    return (imageWidth)
        ? ("Image width must be atleast " + minWidth + "px")
        : "";
  });

  $.validator.addMethod('minImageHeight', function(value, element, minHeight) {
    if (typeof($(element).data('imageHeight')) == 'undefined'){
      return true
    }
    return ($(element).data('imageHeight') || 0) >= minHeight;
  }, function(minHeight, element) {
    var imageHeight = $(element).data('imageHeight');
    return (imageHeight)
        ? ("Image height must be atleast " + minHeight + "px")
        : "";
  });

  var _URL = window.URL || window.webkitURL;
  $('.photoInput').change(function() {
    $photoInput = $(this);
    var image, file;
    if ((file = this.files[0])) {

      image = new Image();

      image.onload = function() {
        $photoInput.data('imageWidth', this.width);
        $photoInput.data('imageHeight', this.height);
      };
      image.src = _URL.createObjectURL(file);
      $photoInput.closest('form').find('div.image_file_name').html("<img src='"+_URL.createObjectURL(file)+"'>");
      $photoInput.closest('form').find('div.image_file_name').find('img').addClass('thumb_img');
    }else{
      $photoInput.closest('form').find('div.image_file_name').html('');
    }
  });


  $('.has-clear input[type="text"]').on('input propertychange', function() {
    var $this = $(this);
    var visible = Boolean($this.val());
    $this.siblings('.form-control-clear').toggleClass('hidden', !visible);
  }).trigger('propertychange');

  $('.form-control-clear').click(function() {
    $(this).siblings('input[type="text"]').val('')
      .trigger('propertychange').focus();
    $(this).closest('form').submit();
  });

  $('#image_alt, #audio_alt').click(function(e) {
    $(this).parent().find(".upload_selected_image_or_audio").trigger('click');
    e.preventDefault();
  });

  $(document).ready(function(){
    $('input[type="file"]').change(function(e){
      var fileName = e.target.files[0].name;
      $(this).parent().find("#selected_image_name").text(fileName);
    });
  });

  $(document).ready(function() {
    $('#date_range').daterangepicker({
      autoUpdateInput: false
    }, function(start_date, end_date) {
      $('#date_range').val(start_date.format('MM/DD/YYYY')+' - '+end_date.format('MM/DD/YYYY'));
    });

    if ($('.is-active').hasClass("active")){
      $("#bulk_tab").addClass("active");
    }else{
      $("#bulk_tab").removeClass("active");
    }
  });
});
