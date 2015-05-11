$(document).ready(function() {
  /* Activating Best In Place */
  jQuery(".best_in_place").best_in_place();

  $('.add-item-form').hide();

  $('.add-item-btn').click(function(){
    $(this).siblings('.add-item-form').slideToggle();
  })

  $('.badge').click(function(){
    $(this).siblings('.box-items').slideToggle();
  });
});