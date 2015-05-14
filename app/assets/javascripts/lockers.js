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

  $('#locker-info-btn').click(function(){
    $('.locker-info').slideToggle();
  });

  // $('.box-list').on('click', 'li.box', function(){
  //   $(this).children('.box-items').slideToggle();
  // });

  $(document).on('mouseenter', 'li.box', function(){
    $(this).css('background-color', '#f2f2f2');
  });

  $(document).on('mouseleave', 'li.box', function(){
    $(this).css('background-color', '#ffffff');
  });

  $(document).on('mouseenter', 'li.item', function(){
    $(this).css('background-color', '#f2f2f2');
    $(this).parents('.box').css('background-color', '#ffffff')
  });

  $(document).on('mouseleave', 'li.item', function(){
    $(this).css('background-color', '#ffffff');
  });

  $('#new_box')
    .on('cocoon:before-insert', function(e,task_to_be_added) {
      task_to_be_added.fadeIn('slow');
    })
    .on('cocoon:after-insert', function(e, added_task) {
      // e.g. set the background of inserted task
      // added_task.css("background","#f2f2f2");
    })
    .on('cocoon:before-remove', function(e, task) {
      // allow some time for the animation to complete
      $(this).data('remove-timeout', 1000);
      task.fadeOut('slow');
    });

});