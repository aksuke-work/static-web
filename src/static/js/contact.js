$(function () {
  $('#zip').keyup(function () {
    AjaxZip3.zip2addr('zip', '', 'address01', 'address01');
  });

  $('.contactForm__select[name="kinds"]').on('change', function() {
    var selectedValue = $(this).val();
    
    if (selectedValue === '採用に関するお問い合わせ') {
      $('#jobType').removeClass('contactForm__dl_is_hide');
    } else {
      $('#jobType').addClass('contactForm__dl_is_hide');
    }
  });
});

$(function () {
  function getUrlParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (search) {
      search.split('&').forEach(function (param) {
        var pair = param.split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      });
    }
    return params;
  }

  var params = getUrlParams();
  if (params['type'] === 'recruit') {
    $('.contactForm__select[name="kinds"] option').each(function() {
      if ($(this).val() === '採用に関するお問い合わせ') {
        $(this).prop('selected', true);
      } else {
        $(this).prop('selected', false);
      }
    });
    $('#jobType').removeClass('contactForm__dl_is_hide');
  }
});
