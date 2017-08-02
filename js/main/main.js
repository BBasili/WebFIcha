// Initialize Firebase
var config = {
  apiKey: "AIzaSyAJ47d5_BQ_TLV5qvFc6jZVlO_RxJM_VG0",
  authDomain: "ficha-ff32c.firebaseapp.com",
  databaseURL: "https://ficha-ff32c.firebaseio.com",
  projectId: "ficha-ff32c",
  storageBucket: "ficha-ff32c.appspot.com",
  messagingSenderId: "714897886749"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
var user;

function login(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  user = firebase.auth().currentUser;
  username = user.displayName;
  useremail = user.email;
  userphotoUrl = user.photoURL;
  useruid = user.uid;
  // pageRed();

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
       window.location = 'status.html';
    } else {
      console.log(error.message);
    }
  });
    // ...
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

function pageRed(){
  firebase.auth().onAuthStateChanged(function(user) {
    username = user.displayName;
    userphotoUrl = user.photoURL;
    useremail = user.email;
    $('.imgUser>img').attr('src', userphotoUrl);
    $('#userInfo .userName').text(username);
    $('#userInfo .userMail').text(useremail);

    var baseData = firebase.database().ref('Users/' + user.displayName);
    // var baseData = new Firebase('https://ficha-ff32c.firebaseio.com/');
    var statusRef = baseData.child('Personagem');
    if (user) {
      console.log(user);
      addLoader();
      $('.loader').addClass('scale-in');
      $('#salvar').click(function() {
        statusRef.set({
          Status:{
            NomeChar: $('#nameChar input').val(),
            Força: $('#forca input').val(),
            Habilidade: $('#habilidade input').val(),
            Armadura: $('#armor input').val(),
            Resistencia: $('#resist input').val(),
            PdF: $('#pdf input').val(),
            FA: $('#fa input').val(),
            FD: $('#fd input').val(),
            HP: $('#hpTotal').val(),
            MP: $('#mpTotal').val(),
          }
        });
      });
      statusRef.on("child_added", function(childSnapshot) {
        var childData = childSnapshot.val();
          $('#nameChar input').attr('value', childData.NomeChar);
          $('#forca input').attr('value', childData.Força);
          $('#habilidade input').attr('value', childData.Habilidade);
          $('#armor input').attr('value', childData.Armadura),
          $('#resist input').attr('value', childData.Resistencia),
          $('#pdf input').attr('value', childData.PdF),
          $('#fa input').attr('value', childData.FA),
          $('#fd input').attr('value', childData.FD),
          $('#hpTotal').attr('value', childData.HP),
          $('.health-bar').attr('data-value', childData.HP),
          $('.health-bar').attr('data-total', childData.HP),
          $('#mpTotal').attr('value', childData.MP),
          $('.mana-bar').attr('data-value', childData.MP),
          $('.mana-bar').attr('data-total', childData.MP),

          $('#nameChar, #forca, #habilidade, #armor, #resist, #pdf, #fa, #fd').find('label').addClass('active');
          if ($('#fAextra')!=' ') {
            console.log($(this));
          }
      });
      statusRef.on("value", function() {
        $('.loader').addClass('scale-out').removeClass('scale-in').remove();
        $('#status').addClass('scale-in').removeClass('scale-out');
        $('#fAfoca').val($('#forca input').val());
        $('#fAhab, #fDhab').val($('#habilidade input').val());
        $('#fDarmor').val($('#armor input').val());
        if ($('#fAextra')!=' ') {
          console.log($(this).val('0'));
        }
      });
      pv();
      mp();
      listarVantagens(baseData);
    } else {
      // No user is signed in.
    }
  });
  $('#status input').focus(function() {
    $('#salvar').toggleClass('scale-in');
  });
  $('#status input').focusout(function() {
    $('#salvar').toggleClass('scale-in');
  });
}
function listarVantagens(baseData) {
  var myVantsRef = baseData.child('Vantagens/');
  myVantsRef.on('value', function(snapshot) {
    var childData = snapshot.val();
    snapshot.forEach(function(childSnapshot){
      var childData = childSnapshot.val();
      var childDataKey = childSnapshot.key;
      $('#listaVantagens .collapsible').append('<li id="'+childData.Nome+'"><div class="collapsible-header" id="vantNome"><span class="badge blue">'+childData.Custo+'</span>'+childData.Nome+'</div><div class="collapsible-body"><span id="vantDescr">'+childData.Descricao+'</span></div></li>');
    })
    $('#listaVantagens').removeClass('scale-out').addClass('scale-in');
  });
}

function sair(){
  firebase.auth().signOut().then(function() {
    window.location = 'index.html';

    console.log(' saiu ');
}, function(error) {
  // An error happened.
});
}

function calculoFA(){
  $('#forca, #habilidade').find('input').change(function(e) {
    e.preventdefault
    var soma = 0;
    $( ".fa" ).val() == 0;
    $( ".fa" ).each( function() {
        soma += Number( $( this ).val() );
    } );
    $( "#fa input" ).val( soma );
  });
}
function calculoFD(){
  $('#armor input, #habilidade input').change(function(e) {
    e.preventdefault
    var soma = 0;
    $( ".fa" ).val() == 0;
    $( ".fd" ).each( function() {
        soma += Number( $( this ).val() );
    } );
    $( "#fd input" ).val( soma );
  });
}
function pv(){
    var hitBtn = $('.hpDamage'),
        hBar = $('#hp'),
        bar = hBar.find('.bar'),
        hit = hBar.find('.hit'),
        totalHp = $('#hpTotal');

    hitBtn.change(function(event){
      event.preventDefault()
      var total = hBar.data('total');
      var  value = hBar.attr('data-value', hitBtn.val());
      // if (value < 0) {
  		// 	log("you dead, reset");
      //   return;
      // }
      var totalHp = $('#hp').attr('data-total');
      console.log('totalHp:' + totalHp);
      // max damage is essentially quarter of max life
      var damage = hitBtn.val();
      console.log('dano: ' + damage);
      var newValue = totalHp - damage;
      console.log('newValue: ' + newValue);
      totalHp = newValue;
      console.log('totalHp newValue:' + totalHp);
      // calculate the percentage of the total width
      var barWidth = (newValue / total) * 100;
      var hitWidth = (damage / value) * 100 + "%";
      // show hit bar and set the width
      hit.css('width', hitWidth);
      hBar.data('value', newValue);

      setTimeout(function(){
        hit.css({'width': '0'});
        bar.css('width', barWidth + "%");
      }, 100);
      //bar.css('width', total - value);
      $('.hpTotal').attr('value', newValue);
      hBar.attr('data-total', newValue);
      console.log('totalHp: ' + totalHp);

      $('.hpDamage').val('');
      log(value, damage, hitWidth);
      if( value < 0){
        log("DEAD");
      }
    });

  function log(_total, _damage, _hitWidth){
    var log = $('.log');

    if(_damage !== undefined && _hitWidth !== undefined) {
  	  log.append("<div>H:"+_total+" D:"+_damage+" W:"+_hitWidth+" = " + (_total - _damage) + "</div>");
    } else {
      log.append("<div>"+_total+"</div>");
    }
  };
}
function mp(){
    var hitBtn = $('.mpDamage'),
        hBar = $('#mp'),
        bar = hBar.find('.bar'),
        hit = hBar.find('.hit'),
        totalHp = $('#mpTotal');

    hitBtn.change(function(event){
      event.preventDefault()
      var total = hBar.data('total');
      var  value = hBar.attr('data-value', hitBtn.val());
      // if (value < 0) {
  		// 	log("you dead, reset");
      //   return;
      // }
      var totalHp = $('#mp').attr('data-total');
      console.log('totalHp:' + totalHp);
      // max damage is essentially quarter of max life
      var damage = hitBtn.val();
      console.log('dano: ' + damage);
      var newValue = totalHp - damage;
      console.log('newValue: ' + newValue);
      totalHp = newValue;
      console.log('totalHp newValue:' + totalHp);
      // calculate the percentage of the total width
      var barWidth = (newValue / total) * 100;
      var hitWidth = (damage / value) * 100 + "%";
      // show hit bar and set the width
      hit.css('width', hitWidth);
      hBar.data('value', newValue);

      setTimeout(function(){
        hit.css({'width': '0'});
        bar.css('width', barWidth + "%");
      },100);
      //bar.css('width', total - value);
      $('.mpTotal').attr('value', newValue);
      hBar.attr('data-total', newValue);
      console.log('totalHp: ' + totalHp);

      $('.mpDamage').val('');
      log(value, damage, hitWidth);
      if( value < 0){
        log("DEAD");
      }
    });

  function log(_total, _damage, _hitWidth){
    var log = $('.log');

    if(_damage !== undefined && _hitWidth !== undefined) {
  	  log.append("<div>H:"+_total+" D:"+_damage+" W:"+_hitWidth+" = " + (_total - _damage) + "</div>");
    } else {
      log.append("<div>"+_total+"</div>");
    }
  };
}
function addLoader(){
  var loader = $('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>')

  $('.loader').append(loader);
}
