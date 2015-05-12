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
});