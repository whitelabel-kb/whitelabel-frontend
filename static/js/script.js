(function($){$(document).ready(function(){$('#section-home').flexslider({animation:"slide",animationLoop:!0,slideshowSpeed:5000,directionNav:!0,pauseOnHover:!0,pauseOnAction:!0,controlNav:!0,prevText:"",nextText:""});$('#carousel').flexslider({animation:"slide",controlNav:!1,animationLoop:!1,slideshow:!1,itemWidth:105,itemMargin:5,asNavFor:'#slider',prevText:"",nextText:""});$('#slider').flexslider({animation:"slide",controlNav:!1,animationLoop:!1,slideshow:!1,sync:"#carousel",prevText:"",nextText:""});$(function(){var dateFormat="mm/dd/yy",from=$("#from").datepicker({defaultDate:"+1w",changeMonth:!0,numberOfMonths:1,showOtherMonths:!0,selectOtherMonths:!0,showAnim:"slide"}).on("change",function(){to.datepicker("option","minDate",getDate(this))}),to=$("#to").datepicker({defaultDate:"+1w",changeMonth:!0,numberOfMonths:1,showOtherMonths:!0,selectOtherMonths:!0,showAnim:"slide"}).on("change",function(){from.datepicker("option","maxDate",getDate(this))});function getDate(element){var date;try{date=$.datepicker.parseDate(dateFormat,element.value)}catch(error){date=null}
return date}});pagename=$('#pagename').val();if(pagename=='about'){$('.white-logo').show()}
else if(pagename=='contact'){$('.white-logo').show()}
else if(pagename=='account'){$('.white-logo').show()}
else{}})})(jQuery)