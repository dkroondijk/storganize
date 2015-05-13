$(document).ready(function() {
  /* Activating Best In Place */
  jQuery(".best_in_place").best_in_place();

  $('.add-item-form').hide();

  $('.box-list').on('click', '.add-item-btn', function(){
    $(this).siblings('.add-item-form').slideToggle();
  })

  $('.box-list').on('click', '.badge', function(){
    $(this).siblings('.box-items').slideToggle();
  });

  $('#search-field').change(function(){
    var filter = $('#search-field').val();
    $("li.box ul li span:not(:contains('"+filter+"'))").parents('.box').hide();
    $("li.box ul li span:contains('"+filter+"')").parents('.box').show();
  }).keyup(function() {
    $(this).change();
  });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $(function() {
    $( "#sortable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();
  });

});