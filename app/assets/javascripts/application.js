//= require webpack-bundle

// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require_tree ./stores
//= require select2
//= require materialize-sprockets


$(document).ready(function() {
	$('#user_level_id').select2();
	$(".dropdown-button").dropdown();
	$('.modal').modal();
	$(".button-collapse").sideNav();
})

$(document).on('turbolinks:load', function(event) {
  Waves.displayEffect();
  $('.modal').modal();
  $('.scroll-button').click(function() {
	  $('html, body').animate({
	    scrollTop: $("#" + $(this).data('link')).offset().top
	  }, 1000);
	});
});