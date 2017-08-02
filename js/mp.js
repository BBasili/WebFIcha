$(document).ready(function() {
  var hitBtn = $('.mpDamage'),
  reset = $('button.reset'),
  hBar = $('#mp.mana-bar'),
  bar = $('#mp .bar'),
  hit = hBar.find('.hit');

  hitBtn.on("change", function(){
    var total = hBar.data('total'),
    value = hBar.data('value');
    // if (value < 0) {
    //   log("you dead, reset");
    //   return;
    // }
    // max damage is essentially quarter of max life
    var damage = hitBtn.val();
    // damage = 100;
    var newValue = value - damage;
    $('.mana-bar').append('<span>'+newValue+'</span>');
    // calculate the percentage of the total width
    var barWidth = (newValue / total) * 100;
    var hitWidth = (damage / value) * 100 + "%";

    // $('.bar').text(barWidth.data('value'));
    // show hit bar and set the width
    hit.css('width', hitWidth);
    hBar.data('value', newValue);

    setTimeout(function(){
      hit.css({'width': '0'});
      bar.css('width', barWidth + "%");
    }, 500);
    //bar.css('width', total - value);

    // log(value, damage, hitWidth);

    // if( value < 0){
    //   log("DEAD");
    // }
  });
  // reset.on('click', function(e){
  //   hBar.data('value', hBar.data('total'));
  //
  //   hit.css({'width': '0'});
  //
  //   bar.css('width', '100%');
  //   log("resetting health to 1000");
  // });
});
