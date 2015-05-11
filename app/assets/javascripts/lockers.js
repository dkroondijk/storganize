$(document).ready(function() {
  /* Activating Best In Place */
  jQuery(".best_in_place").best_in_place();

  // $('.add-item-form').hide();

  $('.badge').click(function(){
    $(this).siblings('.box-items').slideToggle();
  });
});