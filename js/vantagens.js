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
    var statusRef = baseData.child('Personagem');
    if (user) {
      addLoader();
      $('.loader').addClass('scale-in');
      var statusRef = baseData.child('Vantagens');
      statusRef.on("child_added", function(snapshot) {
        var childData = snapshot.val();
        var vantNome = childData.Nome;
        var vantId = vantNome;
        $('#myVantagens').append('<li id="'+childData.Nome+'"><button id="removeItem" type="submit" class=" waves-effect waves-red btn red-text" onClick="remove()"><i class="material-icons">add</i></button><div class="collapsible-header" id="vantNome">'+childData.Nome+'</div><div class="collapsible-body"><p id="vantCusto">'+childData.Custo+'pontos</p><span id="vantDescr">'+childData.Descricao+'</span></div></li>');
      });
      $('#vantagemDrop').append('<button id="listVants" type="button" class="btn waves-effect waves-blue blue" name="button">Todas as Vantagens</button>');
      var vantagensData = firebase.database().ref('Vantagens/');
        vantagensData.on("value", function(snapshot) {
        $('#listaVantagens').css('display', 'none');
        $('#listVants').click(function(event) {
          event.preventDefault;
          $(this).toggleClass('active');
          if ($(this).hasClass('active')) {
            $(this).text('').append('<i class="large material-icons">add</i>');
            setTimeout(function () {
              $('#listVants i').addClass('rotate');
              $('#listaVantagens').css('display', 'block');
              $('#listaVantagens').append('<div id="vantagemList"><ul class="collapsible" data-collapsible="accordion"></ul></div>');
              snapshot.forEach(function(childSnapshot){
                var childData = childSnapshot.val();
                $('#vantagemList .collapsible').append('<li id="'+childData.Nome+'"><div id="salvarVant"><input name="'+childData.Nome+'" type="checkbox" id="'+childData.Nome+'" /><label for="'+childData.Nome+'"></label></div><div class="collapsible-header" id="vantNome"> <label>'+childData.Nome+'</label></div><div class="collapsible-body"><p id="vantCusto">Custo: '+childData.Custo+' pontos</p><span id="vantDescr">'+childData.Descricao+'</span></div></li>');
                $('#vantagemList li label').on('click', function(event) {
                  event.preventDefault();
                  var item = $(this).parent().find('input').attr('checked','checked');
                  var childData = snapshot.val();
                  var vantNome = childData.Nome;
                  var itemNome = item.attr('id');
                  var itemDescr = $(this).find('#vantDescr').text();
                  var itemCusto = $(this).find('#vantCusto').text();
                  setTimeout(function () {
                    var statusRef = baseData.child('Vantagens/');
                    var vantagensRef = statusRef.child(item.attr('id'));
                    vantagensRef.set({
                        Nome: itemNome,
                        Descricao: itemDescr,
                        Custo: itemCusto
                    });
                    addLoader();
                  }, 750);
                  $(this).off();
                });
              })
              $('#listaVantagens').addClass('scale-in').removeClass('scale-out');
              setTimeout(function () {
                Materialize.showStaggeredList('#vantagemList');
              }, 90);
              $(document).ready(function() {
                 $('.collapsible').collapsible();
              });
            }, 100);
          }else{
            $(this).text('Todas as Vantagens');
            $(this).find('i').remove();
            $('#listVants i').removeClass('rotate').remove();
            $(this).removeClass('active');
            $('#listaVantagens').removeClass('scale-in').addClass('scale-out');
            setTimeout(function () {
              $('#listaVantagens').css('display', 'none');
              $('#vantagemList').remove();
            }, 150);
          }
        });
        $('.loader').addClass('scale-out').removeClass('scale-in').remove();
        $('#vantagemWrap').addClass('scale-in').removeClass('scale-out');
        if ($('#vantagemWrap').hasClass('scale-in')) {
          Materialize.showStaggeredList('#myVantagens');
        }

      });
    } else {
      // No user is signed in.
    }
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
function addLoader(){
  var loader = $('<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div><div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>')

  $('.loader').append(loader);
}

function remove(){
  user = firebase.auth().currentUser;
  username = user.displayName;

  $('#vantagemDrop ul li').on('click', '#removeItem', function(event) {
    event.preventDefault();
    var vantId = $(this).parent().attr('id');
    var baseData = firebase.database().ref('Users/' + user.displayName + '/Vantagens/' + vantId);
    baseData.remove();
    setTimeout(function () {
      location.reload();
    }, 500);
  });
}
